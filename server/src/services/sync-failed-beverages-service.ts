/**
 * bruk prisma til å hente alle drikker som har en error i data raden (feil med søk på navn feks)
 * - BeerSearch fant ikke med navn fra VM
 *    - prøv en smartere måte å bygge opp søkenavn på
 */

import EventBus from '../event-bus/event-bus';
import {
  SyncBeveragesActions,
  SyncBeveragesCategories,
} from '../events/sync-beverages-with-untappd/repository/beverages';
import { BaseService } from '../shared/baseservice';
import { EVENTS } from '../shared/events';

/**
 * Denne servicen bør kjøres manuelt tenker jeg.
 * Grunnen er at om en syncing med untappd har feilet, er man brått nødt
 * til å manuelt føre inn BID eller hva søkestringen skal være.
 * Usikker på hva som er best her as. Kunne hatt et felt i datbasen som er "alternate search string"?
 * Den kunne vært i den errors/data raden, splitte på kolon feks.Kunne da bare kjørt en vanlig sync hvor
 * man ser etter drikker som starter med "Alternate search string: xxx" feks.
 * Kunne kanskje ha skrevet en terminalprogram hvor man vises vinmonopoletnavnet og blir promptet
 * om å selv skrive inn den alternative søkestrengen? Tungvint men effektivt?
 */

class SyncUncsyncablesBase extends BaseService {
  async perform() {
    EventBus.publish(EVENTS.SYNC_BEVERAGES_WITH_UNTAPPD, {
      action: SyncBeveragesActions.Unsyncables,
      category: SyncBeveragesCategories.Beers,
    });
  }
}

const SyncUncsyncables = new SyncUncsyncablesBase();
export default SyncUncsyncables;
