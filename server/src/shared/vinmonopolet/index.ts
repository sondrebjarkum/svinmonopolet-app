import BeverageService from './services/beverages-service';
import StoresService from './services/stores-service';
import { formatVinmonopoletStoreName } from './utils/vinmonopolet-utils';

export const Vinmonopolet = {
  //services
  Beverages: BeverageService,
  Stores: StoresService,

  //utils
  formatVinmonopoletStoreName,
};
