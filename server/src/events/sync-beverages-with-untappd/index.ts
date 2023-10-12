import EventBus from '../../event-bus/event-bus';
import { EVENTS } from '../../shared/events';
import SyncBeveragesWithUntappdService from './services/sync-beverages-service';

const syncBeveragesWithUntappdEvent = () =>
  EventBus.subscribe(
    [EVENTS.SYNC_BEVERAGES_WITH_UNTAPPD, EVENTS.UNTAPPD_SYNC_RESUME],
    SyncBeveragesWithUntappdService, //! <-
    // TODO: bytt ut med query-helper/get-beverages-service.
    //Må ta inn i event payload hva som skal oppdateres i henhold til mjød, øl, sider etc?
    //så med SCHEDULED_UPDATE_AND_SYNC_BEVERAGES skal man jo ta for seg mjød og øl og alt mulig
    //bruke GetBeveragesActions.SyncAll eller noe, når den "all done syncing" treffer inn så gå videre til neste kategori?
  );
export default syncBeveragesWithUntappdEvent;

export const invokeSyncBeveragesWithUntappd = SyncBeveragesWithUntappdService;
