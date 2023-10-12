import { Beers } from '@prisma/client';
import { prisma } from '../../../db';
import EventBus from '../../../event-bus/event-bus';
import { BaseService } from '../../../shared/baseservice';
import { EVENTS } from '../../../shared/events';
import { logError, logNewLine, logService } from '../../../shared/logging';
import { Vinmonopolet } from '../../../shared/vinmonopolet';
import { Facets } from '../../../shared/vinmonopolet/repositories/vinmonopolet-repository';
import {
  SyncBeveragesActions,
  SyncBeveragesCategories,
} from '../../sync-beverages-with-untappd/repository/beverages';

// interface VmBeverage {
//   code: string;
//   name: string;
//   price: number;
//   abv: number;
//   productType: string;
//   containerSize: number;
//   barcode: number;
//   images: Array<{ url: string }>;
// }
// const VmBeverageToPrismaModel = (beverage: VmBeverage) => {
//   return {
//     vmp_id: beverage.code,
//     vmp_name: beverage.name,
//     vmp_image: beverage?.images[0]?.url ?? '',
//     // untappd_name: '',
//     // untappd_rating: '',
//     // untappd_checkins: 0,
//     // untappd_image: '',
//     price: beverage.price ?? 0.0,
//     // abv: beverage.abv ?? 0.0,
//     // style: beverage.productType ?? '',
//     volume: beverage.containerSize ?? 0.0,
//     // data: '',
//     active: true,
//     // brewery: '',
//     new: true,
//     barcode: beverage.barcode.toString() ?? '',
//   };
// };
/**
 * Get all VM given beverage type
 * Compare with DB beverages
 * Update existing and add new
 */
class UpdateBeveragesBase extends BaseService {
  type = 'beverage(s)';

  async perform() {
    logNewLine();
    logService('performing UpdateBeverages');

    try {
      const dbBeverages = await prisma.beers.findMany();

      const [ok, vmBeverages] = await Vinmonopolet.Beverages.perform({
        category: Facets.BEER,
        map: true,
      });

      if (!ok || typeof vmBeverages === 'string') {
        logError('Something went wrong fetching from Vinmonopolet.');
        return this.bad(vmBeverages);
      }

      // Nothing in DB, add all beverages
      if (!dbBeverages || dbBeverages.length < 1) {
        return await this.addAllBeverages(vmBeverages);
      }

      this.total = vmBeverages.length;

      //gå gjennom alle vm drikker, sjekk om den finnes i database, legg til om ikke ellers oppdater
      for (const beverage of vmBeverages) {
        const exists = dbBeverages.find((x) => x.vmp_id == beverage.vmp_id);
        if (exists) {
          // await this.updateBeverage(beverage); //TODO: fix update beverage
          this.skipped = this.skipped + 1;
          continue;
        }
        await this.addBeverage(beverage);
        this.added = this.added + 1;
      }
    } catch (err) {
      console.error(err);
      logError(`somethign went bad in ${this.serviceName}`);
      this.bad(err);
    } finally {
      this.logResult();
      this.resetResults();
      EventBus.publish(EVENTS.UPDATE_STOCK);
    }

    return this.ok('');
  }

  async addBeverage(beverage: Beers) {
    try {
      await prisma.beers.create({
        data: {
          ...beverage,
        },
      });
    } catch (error) {
      logError(`Error adding beverage in ${this.serviceName}`);
      console.error(error);
    }
  }
  async addAllBeverages(vmBeverages: Beers[]) {
    console.log('Adding all beverages...');
    for (const beverage of vmBeverages) {
      await this.addBeverage(beverage);
    }
    return this.ok('');
  }

  // TODO: BUG: will overwrite untappd data?
  async updateBeverage(beverage: Beers) {
    console.log('Updating beverage: ', beverage.vmp_name);

    const updated = await prisma.beers.update({
      where: { vmp_id: beverage.vmp_id },
      data: { ...beverage },
    });

    return this.ok(updated);
  }
}

const UpdateBeverages = new UpdateBeveragesBase();
export default UpdateBeverages;
