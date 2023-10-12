import vinmonopolet from 'vinmonopolet';
import { BaseService } from '../../baseservice';
import VinmonopoletRepository, {
  Facets,
  VinmonopoletProduct,
} from '../repositories/vinmonopolet-repository';
import { Beers } from '@prisma/client';

// Skal hente alle øl fra vm
// Skal lagre alle øl i databasen
class BeverageServiceBase extends BaseService {
  async perform({ category, map = true }: { category: Facets; map: boolean }) {
    return await this.get(category, map);
  }

  async get(facet: Facets, map: boolean = true) {
    const beverages = await VinmonopoletRepository.getProducts(facet);

    // this.ok(map ? this.toPrismaModel(beverages) : beverages)
    return beverages
      ? this.ok(this.toPrismaModel(beverages))
      : this.bad('failed to fetch beverages');
  }
  toPrismaModel(beverages: VinmonopoletProduct[]) {
    return beverages.map((beverage) => {
      return {
        vmp_id: beverage.code.toString(),
        vmp_name: beverage.name,
        vmp_image: beverage?.images[0]?.url ?? '',
        vmp_link: '',
        price: beverage.price ?? 0.0,
        volume: beverage.containerSize ? Math.floor(beverage.containerSize * 10) : 0,
        active: true,
        new: true,
        barcode: beverage.barcode ? beverage.barcode.toString() : '',
      } as Beers;
    });
  }
}
const Beverages = new BeverageServiceBase();
export default Beverages;
