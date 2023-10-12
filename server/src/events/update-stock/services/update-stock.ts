import { Stock, Stores } from '@prisma/client';
import { prisma } from '../../../db';
import { BaseService } from '../../../shared/baseservice';
import { logDone, logError, logInfo, logService } from '../../../shared/logging';
import { Vinmonopolet } from '../../../shared/vinmonopolet';
import vinmonopolet from 'vinmonopolet';
// import { Facet } from 'vinmonopolet/src/models/Facet';
import { datesAreOnSameDay } from '../../../shared/dates';
import EventBus from '../../../event-bus/event-bus';
import { EVENTS } from '../../../shared/events';
import {
  SyncBeveragesActions,
  SyncBeveragesCategories,
} from '../../sync-beverages-with-untappd/repository/beverages';
const Facet = require('vinmonopolet/src/models/Facet');

// import { type VmStore } from "../../../shared/services/vinmonopolet/services/vinmonopolet-stores-service";
interface StoreFacet {
  name: string;
  count: number;
  query: any;
}

interface Filter {
  stores: { id: string }[];
}

interface StoreFacetStockItem {
  [key: string]: any;
  code: string;
  availability: {
    storeAvailability: {
      mainText: string;
    };
  };
}

interface FacetStockAndStores extends StoreFacetStockItem, Stores {}

type FacetsResponse = {
  productSearchResult: {
    breadcrumbs: any;
    currentQuery: any;
    facets: any;
    freeTextSearch: any;
    pagination: any;
    products: any;
    sorts: any;
  };
  contentSearchResult: {
    breadcrumbs: any;
    currentQuery: any;
    facets: any;
    freeTextSearch: any;
    pagination: any;
    sorts: any;
    results: any;
  };
};
/**
 * Queries Vinmonopolet for all current stores and updates DB with new ones
 */
class UpdateStockBase extends BaseService {
  type = 'stock(s)';
  // async perform() {
  //   logInfo('deleting stocks...');
  //   const done = await prisma.stock.deleteMany({});
  //   if (done) logDone('done deleting');
  //   else logError('error deleting');
  // }
  async perform() {
    logService('Performing UpdateStock...');
    const stores = await prisma.stores.findMany();
    const storeFacets = await this.getStoreFacets();

    if (!stores || stores.length < 1) {
      logError('Found no stores in DB! Have you forgotten to update stores?');
      return this.bad('found no stores in DB');
    }

    if (!storeFacets) {
      return this.bad('something went wrong fetching store facets');
    }

    let retry = false;
    for (const store of stores) {
      if (store.name == 'eLager') {
        // Skip nettlager, not relevant
        logInfo('Skipped eLager');
        continue;
      }
      do {
        try {
          const storeFacetWithStock = await this.getStoreFacetStock(storeFacets, store);

          if (!storeFacetWithStock) {
            logError('fant ikke storeFacetValue gitt');
            continue;
          }

          const newStock = await this.getNewStock(storeFacetWithStock, store);

          this.total = newStock?.length ?? -1;

          if (newStock) {
            await this.updateStock(newStock);
          }
        } catch (error) {
          const err = error as any;
          if (err.statusCode === 429) {
            logError(`Request limit reached in update-stock (@${store.name})`);
            await new Promise((resolve) => setTimeout(resolve, 60000));
            retry = true;
            continue;
          }

          console.error(error);
          logError(`error in update-stock (@${store.name})`);
          retry = false;
          return;
        }
        retry = false;
      } while (retry);

      retry = false;

      logDone(`Synced stock for 🏬${store.name}`);
    }
    this.logResult();
    this.resetResults();
    EventBus.publish(EVENTS.SYNC_BEVERAGES_WITH_UNTAPPD, {
      action: SyncBeveragesActions.NotSynced,
      category: SyncBeveragesCategories.Beers, //TODO: skal kalle på "All"
    });
  }

  async updateStock(newStock: Stock[]) {
    for (const stock of newStock) {
      try {
        const result = await prisma.stock.upsert({
          where: {
            beerId_storeId: {
              beerId: stock.beerId,
              storeId: stock.storeId,
            },
          },
          update: { quantity: stock.quantity },
          create: {
            beer: { connect: { vmp_id: stock.beerId } },
            store: { connect: { store_id: stock.storeId } },
            quantity: !stock.quantity ? 0 : stock.quantity,
          },
        });
        if (stock.quantity === 0) {
          this.result.custom('no stock');
        } else if (datesAreOnSameDay(new Date(result.createdAt), new Date())) {
          this.added = this.added + 1;
        } else {
          this.updated = this.updated + 1;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  //gets all facets of stores
  async getStoreFacets() {
    try {
      // const facets = await vinmonopolet.getFacets();
      const facets = (await fetch(
        'https://www.vinmonopolet.no/vmpws/v2/vmp/search?q=:relevance:mainCategory:&searchType=product&fields=FULL',
      ).then((res) => res.json())) as FacetsResponse;

      const allFacets = facets.productSearchResult.facets.map((f: any) => new Facet(f));
      const storesFacets = allFacets.find((facet: any) => facet.title == 'stores');

      // const storeFacets = facets.productSearchResult.facets.find(
      //   (facet: StoreFacet) => facet.name === 'Butikker',
      // );

      // const storeFacetValue = storeFacets.values as StoreFacet[];
      // const storeFacetValue: StoreFacet[] = storeFacets.values.map((facet: any) => ({
      //   name: facet.name,
      //   count: facet.count,
      //   query: facet.query,
      // }));

      return storesFacets;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  //gets stock (facetvalues) of specific store, merges stock with store
  async getStoreFacetStock(storeFacets: any, store: Stores) {
    // TODO: move to Vinmonopolet.StockService sammen med getStoreFacets()
    // TODO: bruk Vinmonopolet.Stores.perform()
    // ta inn gitt kategori, bruk den på vinmonopolet.facet.category.BEER, meads ciders etc

    const storeFacet = storeFacets.values.find((e: any) => e.name.includes(store.name));

    let { pagination, products } = await vinmonopolet.getProducts({
      facets: [storeFacet, vinmonopolet.Facet.Category.BEER], //TODO: add categories, like mead and cider
    });

    while (pagination.hasNext) {
      const response = await pagination.next();
      products = products.concat(response.products);
      pagination = response.pagination;
    }

    //now stockitems are merged with stores
    const stock: FacetStockAndStores[] = products.map((facet: StoreFacetStockItem) => ({
      ...facet,
      ...store,
    }));
    return stock;
  }

  async getNewStock(storeFacetStock: FacetStockAndStores[], store: Stores) {
    const extractStock = (s: string) => {
      const stock = parseInt(s.split(':')[1] as string, 10) ?? 0;
      if (!stock) {
        return 0;
      }
      return stock;
    };

    try {
      const oldStock = await prisma.stock.findMany({
        where: {
          storeId: store.store_id,
        },
      });

      const newStock = storeFacetStock.map((s) => {
        return {
          beerId: s.code,
          quantity: extractStock(s.availability.storeAvailability.mainText),
          storeId: s.store_id,
        } as Stock;
      });

      //if no stock for this store in db, add it all
      if (!oldStock || oldStock.length < 1) {
        return newStock;
      }

      const stockMap = new Map<string, number>();

      newStock.forEach((item) => {
        stockMap.set(item.beerId, item.quantity);
      });

      oldStock.forEach((item) => {
        if (!stockMap.has(item.beerId)) {
          stockMap.set(item.beerId, item.quantity);
        }
      });

      const combinedStock: Stock[] = [];

      stockMap.forEach((quantity, beerId) => {
        const stockItem = { beerId, quantity, storeId: store.store_id } as Stock;
        combinedStock.push(stockItem);
      });

      const updated = combinedStock.map((combined) => {
        const matchingNewItem = newStock.find(
          (newItem) => newItem.beerId === combined.beerId,
        );
        if (!matchingNewItem) {
          return {
            ...combined,
            quantity: 0,
          } as Stock;
        }
        return combined as Stock;
      });

      return updated;
    } catch (err) {
      console.error(err);
      logError('nope i update stock service getNewStock');
      return;
    }
  }
}

const UpdateStockService = new UpdateStockBase();
export default UpdateStockService;
