import { Stock, Stores } from '@prisma/client';
import { prisma } from '../../../db';
import { BaseService } from '../../../shared/baseservice';
import { logDone, logError, logService } from '../../../shared/logging';
import { Vinmonopolet } from '../../../shared/vinmonopolet';
import vinmonopolet from 'vinmonopolet';
import EventBus from '../../../event-bus/event-bus';
import { EVENTS } from '../../../shared/events';
import {
  SyncBeveragesActions,
  SyncBeveragesCategories,
} from '../../sync-beverages-with-untappd/repository/beverages';

interface StoreFacet {
  name: string;
  count: number;
  query: string;
}

/**
 * Queries Vinmonopolet for all current stores and updates DB with new ones
 */
class UpdateStoresBase extends BaseService {
  type = 'store(s)';

  async perform() {
    logService('Performing UpdateStores...');

    const existingStores = await prisma.stores.findMany();
    const stores = (await Vinmonopolet.Stores.perform()) as Stores[];

    if (!stores) {
      logError(
        `something went wrong when fetching stores from Vinmonopolet in ${this.serviceName}`,
      );
      return;
    }

    this.total = stores.length;

    if (existingStores.length === stores.length) {
      this.skipped = existingStores.length;
    }

    if (existingStores.length !== stores.length) {
      if (existingStores.length === 0) {
        await this.addAllStores(stores);
      } else {
        await this.addNewStores(stores, existingStores);
      }
    }

    this.logResult();

    EventBus.publish(EVENTS.UPDATE_BEVERAGES, {
      action: SyncBeveragesActions.NotSynced,
      category: SyncBeveragesCategories.Beers, //TODO: skal kalle på "All"
    });
  }

  async addAllStores(stores: Stores[]) {
    for (const store of stores) {
      await this.addStore(store);
    }
  }

  async addNewStores(stores: Stores[], existingStores: Stores[]) {
    for (const store of stores) {
      const exists = existingStores.find((x) => x.name == store.name);
      if (exists) {
        this.result.skipped();
        continue;
      }
      await this.addStore(store);
    }
  }

  async addStore(store: Stores) {
    try {
      await prisma.stores.create({
        data: store,
      });
      this.result.added();
    } catch (error) {
      logError(`error adding store ${store.name}`);
    }
  }

  async updateStore(store: Stores) {
    throw new Error('not implemented');
    this.result.updated();
  }
}

const UpdateStores = new UpdateStoresBase();
export default UpdateStores;
