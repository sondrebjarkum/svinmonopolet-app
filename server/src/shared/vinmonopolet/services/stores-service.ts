import vinmonopolet from 'vinmonopolet';
import { BaseService } from '../../baseservice';
import VinmonopoletRepository, { Facets } from '../repositories/vinmonopolet-repository';
import { Beers, Stores } from '@prisma/client';
import { formatVinmonopoletStoreName } from '../utils/vinmonopolet-utils';
import { StoreDetailsResponse } from '../interfaces/interfaces';

// Skal hente alle øl fra vm
// Skal lagre alle øl i databasen
class StoresServiceBase extends BaseService {
  async perform({ storeId, map = true }: { storeId?: number; map?: boolean } = {}) {
    return await this.get(storeId, map);
  }

  async get(storeId?: number, map?: boolean) {
    const stores = await VinmonopoletRepository.getStores();

    if (!stores) {
      return;
    }

    const formattedStores = stores.map((store) => {
      return {
        ...store,
        storeName: formatVinmonopoletStoreName(store.storeName),
      };
    });

    if (map) {
      return this.toPrismaModel(formattedStores);
    }

    return formattedStores;
  }

  toPrismaModel(stores: StoreDetailsResponse[]) {
    const ok = stores.map((store) => {
      return {
        vmp_id: store.storeId,
        name: store.storeName,
        category: store.category,
        address: store.address.street,
        city: store.address.city,
        zip: store.address.postalCode,
        lon: store.address.gpsCoord.split(';')[0],
        lat: store.address.gpsCoord.split(';')[1],
      } as Stores;
    });
    return ok as Array<Stores>;
  }
}
const StoresService = new StoresServiceBase();
export default StoresService;
