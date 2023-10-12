import { Stores } from '@prisma/client';
import { prisma } from '../db';
import { BaseService } from '../shared/baseservice';
import { logError } from '../shared/logging';
import { Vinmonopolet } from '../shared/vinmonopolet';

class CreateStoresServiceBase extends BaseService {
  async perform() {
    const existingStores = await prisma.stores.findMany();

    const stores = (await Vinmonopolet.Stores.perform({
      map: true,
    })) as Stores[];

    if (existingStores.length < stores.length) {
      //TODO: add missing stores
      return this.ok('added new stores');
    }

    if (typeof stores == 'string' || !stores) {
      logError('something bad stores');
    }

    for (const store of stores) {
      try {
        await prisma.stores.create({
          data: store,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}

const CreateStoresService = new CreateStoresServiceBase();
export default CreateStoresService;

// TODO: @deprecated?
