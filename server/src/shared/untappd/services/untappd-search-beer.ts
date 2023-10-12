import axios from 'axios';
import { logFetchError, logInfo, logNeutral } from '../../logging';
import KeyProvider, { Key } from '../../keyprovider';
import Endpoints from '../utils/url-builder';
import { UntappdErrors } from '../../../events/sync-beverages-with-untappd/services/sync-beverages-service';
import { BeerSearchResult } from '../interfaces/untappd';
import UntappdRequestBase from '../untappd-request-base';

class UntappdSearchBeerServiceBase extends UntappdRequestBase {
  // rateLimitReached(triedKeys: number) {
  //   KeyProvider.switch();
  //   if (triedKeys >= KeyProvider.allKeys.length - 1) {
  //     return true;
  //   }
  //   return false;
  // }

  async perform(beverageName: string) {
    return await this.searchBeer(beverageName);
  }

  async searchBeer(query: string) {
    // for (let triedKeys = 0; triedKeys < KeyProvider.allKeys.length + 1; triedKeys++) {
    do {
      const { clientId, clientSecret } = KeyProvider.currentKey;
      const url = Endpoints.Search({ query, clientId, clientSecret });

      try {
        const response = await axios.get(url);
        const result = response.data.response as BeerSearchResult;
        if (result.beers.items.length < 1) {
          return this.bad(UntappdErrors.Unsyncable);
        }
        return this.ok(result);
        //
      } catch (error: any) {
        const status = error?.response?.status;
        const message = error?.response?.statusText;

        if (status === 429) {
          logNeutral(
            `rate limit reached for key ${KeyProvider.currentKey.clientId.slice(
              0,
              10,
            )}[...], switching`,
          );

          // const rateLimitReached = KeyProvider.rateLimitReached();
          // if (rateLimitReached) {
          //   return this.bad(UntappdErrors.LimitReached, status);
          // }
          KeyProvider.switch();
        } else {
          logFetchError(
            `BeerSearch responed with status '${status}' and message '${message}', query: ${query}`,
          );
          return this.bad(`${UntappdErrors.Unhandled} in ${this.serviceName}`, status);
        }
      }
    } while (!KeyProvider.rateLimitReached());
    // }

    return this.bad(UntappdErrors.LimitReached);
  }
}

// const mockBeerSearchResult: BeerSearchResult = {
//   found: 2,
//   offset: 0,
//   limit: 25,
//   term: 'IPA',
//   parsed_term: 'ipa',
//   beers: {
//     count: 2,
//     items: [
//       {
//         checkin_count: 1000,
//         have_had: true,
//         your_count: 0,
//         beer: {
//           bid: 123,
//           beer_name: 'Hazy IPA',
//           beer_label: 'https://example.com/labels/hazy-ipa.png',
//           beer_abv: 6.5,
//           beer_ibu: 60,
//           beer_description: 'A hazy and juicy IPA with tropical notes.',
//           created_at: '2022-04-22T10:00:00Z',
//           beer_style: 'IPA - New England',
//           auth_rating: 4.2,
//           wish_list: false,
//           in_production: 1,
//         },
//         brewery: {
//           brewery_id: 456,
//           brewery_name: 'Cloudwater Brew Co.',
//           brewery_slug: 'cloudwater-brew-co',
//           brewery_label: 'https://example.com/brewery-labels/cloudwater.png',
//           country_name: 'United Kingdom',
//           contact: {
//             twitter: 'cloudwaterbrew',
//             facebook: 'https://www.facebook.com/cloudwaterbrew',
//             instagram: 'cloudwaterbrew',
//             url: 'https://cloudwaterbrew.co/',
//           },
//           location: {
//             brewery_city: 'Manchester',
//             brewery_state: '',
//             lat: 53.4815,
//             lng: -2.2411,
//           },
//           brewery_active: 1,
//         },
//       },
//       {
//         checkin_count: 500,
//         have_had: false,
//         your_count: 0,
//         beer: {
//           bid: 456,
//           beer_name: 'West Coast IPA',
//           beer_label: 'https://example.com/labels/west-coast-ipa.png',
//           beer_abv: 7.2,
//           beer_ibu: 80,
//           beer_description:
//             'A classic West Coast-style IPA with a bitter punch.',
//           created_at: '2022-04-21T15:30:00Z',
//           beer_style: 'IPA - American',
//           auth_rating: 3.8,
//           wish_list: true,
//           in_production: 0,
//         },
//         brewery: {
//           brewery_id: 789,
//           brewery_name: 'Stone Brewing',
//           brewery_slug: 'stone-brewing',
//           brewery_label: 'https://example.com/brewery-labels/stone.png',
//           country_name: 'United States',
//           contact: {
//             twitter: 'stonebrewing',
//             facebook: 'https://www.facebook.com/StoneBrewingCo',
//             instagram: 'stonebrewing',
//             url: 'https://www.stonebrewing.com/',
//           },
//           location: {
//             brewery_city: 'Escondido',
//             brewery_state: 'CA',
//             lat: 33.1153,
//             lng: -117.1326,
//           },
//           brewery_active: 1,
//         },
//       },
//     ],
//   },
// };
const SearchBeer = new UntappdSearchBeerServiceBase();
export default SearchBeer;
