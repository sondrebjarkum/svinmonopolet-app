import { Beers } from '@prisma/client';
import { prisma } from '../../../db';
import EventBus from '../../../event-bus/event-bus';
import { BaseService } from '../../../shared/baseservice';
import { EVENTS } from '../../../shared/events';
import {
  logDone,
  logError,
  logInfo,
  logLimitReached,
  logNeutral,
  logStartSync,
  logUntappd,
  logWarning,
} from '../../../shared/logging';
import { Untappd } from '../../../shared/untappd';
import {
  UntappdBeer,
  BeerSearchResult,
  UntappdBrewery,
  BeerDetailsResult,
} from '../../../shared/untappd/interfaces/untappd';
import { formatVinmnopoletBeerName } from '../../../shared/untappd/utils/format-search-name';

import GetBeverages, {
  SyncBeveragesActions,
  SyncBeveragesCategories,
} from '../repository/beverages';
import KeyProvider from '../../../shared/keyprovider';
import { AI } from '../../../shared/openai';
import { compareStrings } from '../../../services/compare-beverage-names';

type PrismaUpdateBeerModel = {
  untappd_bid: string;
  untappd_brewery: string;
  untappd_link: string;
  untappd_name: string;
  untappd_rating: string;
  untappd_checkins: number;
  untappd_image: string;
  abv: number;
  style: string;
  new: boolean;
};

type Filter = {
  action: SyncBeveragesActions;
  category?: Partial<SyncBeveragesCategories>;
};

export enum UntappdErrors {
  LimitReached = 'rate limit reached',
  Unsyncable = 'No search result from Untappd for query',
  Unhandled = 'unhandled error while fetching in Untappd services',
  FatalError = 'fatal error, something went really wrong when fetching from Untappd services',
}

const ErrorHandler = {
  [UntappdErrors.LimitReached]: handleLimitReached,
  [UntappdErrors.Unsyncable]: handleUnsyncable,
  [UntappdErrors.Unhandled]: handleUnhandled,
  [UntappdErrors.FatalError]: handleFatalError,
};

const Abort = true;

async function handleUnhandled({ message }: { message: string }) {
  logError(message);
}

async function handleFatalError({ message }: { message: string }) {
  logError(message);
  logUntappd(
    'Fatal error! Aborting sync, either manually restart job or wait untill next sync schedule',
  );
  return Abort;
}

async function handleLimitReached({ filter }: { filter: Filter }) {
  logLimitReached();
  setTimeout(() => {
    //TODO: her må man etterhvert sende inn kategori og action som skal utføres via SyncFilter
    //bare send gjennom i payload til publish det filteret som ble sendt med
    EventBus.publish(EVENTS.UNTAPPD_SYNC_RESUME, {
      action: filter.action,
      category: filter.category,
    });
  }, 60 * 60 * 1000);
  KeyProvider.reset();
  return Abort;
}

async function handleUnsyncable({ beer }: { beer: Beers }) {
  const query = formatVinmnopoletBeerName(beer.vmp_name ?? '');
  logError(`No search result from Untappd - query: ${query} - vm name: ${beer.vmp_name}`);

  await markBeverageAsBad(beer.vmp_id, query);
}

async function markBeverageAsBad(vmp_id: string, query: string) {
  try {
    await prisma.beers.update({
      where: {
        vmp_id: vmp_id,
      },
      data: {
        error: `${UntappdErrors.Unsyncable}: ${query}`,
      },
    });
    logNeutral('marked beverage as bad');
  } catch (error) {
    logError('something went wrong marking bevereage as bad');
    console.error(error);
    logNeutral(`vmp_id: ${vmp_id}, query: ${query}`);
  }
}

class SyncBeveragesWithUntappdServiceBase extends BaseService {
  filter: Filter | undefined;

  async perform(filter: Filter) {
    this.type = 'beer(s)';
    if (this.locked()) {
      return;
    }

    if (!filter) {
      logError(
        'sync bevereges with untappd was called witohout any filter! Filter Action is required.',
      );
      return;
    }

    this.lock();

    this.filter = filter;

    const [ok, beverages] = await GetBeverages.perform(filter);

    if (!ok || typeof beverages === 'string') {
      logError(`${beverages}`);
      return;
    }

    this.total = beverages.length;

    logStartSync(
      beverages.length.toString(),
      filter.action.toString(),
      filter.category ?? 'beers',
    );

    if (beverages.length === 0) {
      logDone('All done syncing with Untappd 💪 - have you synced un-syncables?');
      return;
    }

    await this.sync(beverages);
  }

  untappdDataToPrismaUpdateModel({
    beer,
    brewery,
    checkins,
  }: {
    beer: UntappdBeer;
    brewery: UntappdBrewery;
    checkins: number;
  }) {
    const model: PrismaUpdateBeerModel = {
      untappd_bid: beer.bid.toString(),
      untappd_brewery: brewery.brewery_name,
      untappd_checkins: checkins,
      untappd_link: `https://untappd.com/b/${beer.beer_slug}/${beer.bid}`,
      untappd_name: beer.beer_name,
      untappd_rating: beer.rating_score.toString(),
      untappd_image: beer.beer_label,
      abv: beer.beer_abv,
      style: beer.beer_style,
      new: true,
    };
    return model;
  }

  extractBeerData(untappdSearchResult: BeerSearchResult, beerDetails: BeerDetailsResult) {
    //TODO: kan dette gjøres litt smartere? For å få bedre match mellom vm navn og untappd resultat?
    const beer = untappdSearchResult.beers.items[0]?.beer as UntappdBeer;
    beer.rating_score = beerDetails.rating_score;
    return {
      beer: beer,
      brewery: untappdSearchResult.beers.items[0]?.brewery as UntappdBrewery,
      checkins: untappdSearchResult.beers.items[0]?.checkin_count as number,
    };
  }

  async updateBeverage(vmp_id: string, beverage: PrismaUpdateBeerModel) {
    try {
      await prisma.beers.update({
        where: {
          vmp_id,
        },
        data: {
          ...beverage,
        },
      });

      logDone(
        `Updated ${beverage.untappd_brewery} - ${beverage.untappd_name} with Untappd data, praise the beer Gods 🙏`,
      );

      this.result.updated();

      return;
    } catch (error) {
      console.error(error);
      logError('Beverage could not be updated 💀');
      this.result.skipped();
      throw new Error(UntappdErrors.FatalError);
    }
  }

  async sync(beverages: Beers[]) {
    for (const beer of beverages) {
      //TODO: sjekk at alle attributter som vmp_name er ok, ellers continue, type guard check
      // if (beer.error?.startsWith(UntappdErrors.Unsyncable)) {
      //   continue;
      // }

      try {
        // let formattedName = await AI.BeverageNameExtractor.perform(
        //   beer.vmp_name as string,
        // );

        // if (!formattedName || formattedName == '') {
        //   formattedName = formatVinmnopoletBeerName(beer.vmp_name ?? '') as string;
        //   logWarning(`Ai failed, used classic formatter: ${formattedName}`);
        // }

        const formattedName = formatVinmnopoletBeerName(beer.vmp_name ?? '') as string;

        const [okSearchBeer, untappdSearchResult] = await Untappd.SearchBeer.perform(
          formattedName,
        );

        if (!okSearchBeer || typeof untappdSearchResult === 'string') {
          throw new Error(`${untappdSearchResult}`);
        }

        // om det er flere resultater, velg den som best matcher
        // if (untappdSearchResult.beers.items.length > 1) {
        //   logNeutral('More than 2 results from search, hmm...');

        //   const items = untappdSearchResult.beers.items;

        //   if (untappdSearchResult.beers.items.length > 4) {
        //     logNeutral(
        //       `okei så er en god del her da: ${untappdSearchResult.beers.items.length}`,
        //     );
        //     const calculated = items.map((item) => {
        //       const untappd_name = `${item.brewery.brewery_name} ${item.beer.beer_name}`;
        //       return {
        //         untappd_name,
        //         query: beer.vmp_name,
        //         score: compareStrings(untappd_name, formattedName as string),
        //       };
        //     });
        //     console.log(calculated);
        //     const bestMatch = calculated.reduce((max, beer) => {
        //       return beer.score > max.score ? beer : max;
        //     });
        //     console.log('bestMatch:', bestMatch);
        //     await new Promise((resolve) => setTimeout(resolve, 5000));
        //   } else {
        //     const calculated = items.map((item) => {
        //       const untappd_name = `${item.brewery.brewery_name} ${item.beer.beer_name}`;
        //       return {
        //         untappd_name,
        //         query: formattedName,
        //         score: compareStrings(untappd_name, formattedName as string),
        //       };
        //     });
        //     console.log(calculated);
        //     const bestMatch = calculated.reduce((max, beer) => {
        //       return beer.score > max.score ? beer : max;
        //     });
        //     console.log('bestMatch:', bestMatch);
        //     await new Promise((resolve) => setTimeout(resolve, 5000));
        //   }
        // }

        // ###################### TIMEOUT! ######################
        // Need a timeout so that Untappd doesnt shit it's pants
        await new Promise((resolve) => setTimeout(resolve, 5000));
        // ######################################################

        const beerId = untappdSearchResult.beers.items[0]?.beer.bid.toString() as string;

        const [okBeerDetails, beerDetails] = await Untappd.GetBeverageDetails.perform(
          beerId,
        );

        if (!okBeerDetails || typeof beerDetails === 'string') {
          throw new Error(`${beerDetails}`);
        }

        const untappdBeer = this.extractBeerData(untappdSearchResult, beerDetails.beer);

        const beverage = this.untappdDataToPrismaUpdateModel({
          ...untappdBeer,
        });

        await this.updateBeverage(beer.vmp_id, beverage);
        //
      } catch (error) {
        const err = error as Error;
        const message = err.message as UntappdErrors;
        const abort = await ErrorHandler[message]({
          message,
          beer,
          filter: this.filter as Filter,
        });
        this.result.skipped();

        if (abort) {
          this.logResult();
          this.resetResults();
          this.unlock();
          return;
        }
      }
    }

    this.unlock();
    this.logResult();
    this.resetResults();
  }
}

const SyncBeveragesWithUntappdService = new SyncBeveragesWithUntappdServiceBase();
export default SyncBeveragesWithUntappdService;
