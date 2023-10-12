import { logCustom, FontColors, logDone, logNewLine } from '../shared/logging';
import syncBeveragesWithUntappdEvent from './sync-beverages-with-untappd';
import updateStoresEvent from './update-stores';
import updateStockEvent from './update-stock';
import { UpdateBeveragesEvent } from './update-beverages';

const events = {
  register: () => {
    logCustom('Event Bus', 'Registering events', FontColors.Muted);
    //
    syncBeveragesWithUntappdEvent();
    updateStoresEvent();
    UpdateBeveragesEvent.register();
    updateStockEvent();
    //
    logDone('⏰ events registered');
    logNewLine();
  },
};
export default events;
