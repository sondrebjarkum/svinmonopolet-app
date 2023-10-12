import EventBus from '../../event-bus/event-bus';
import { EVENTS } from '../../shared/events';
import UpdateStores from './services/update-stores-service';

const updateStoresEvent = () => EventBus.subscribe(EVENTS.UPDATE_STORES, UpdateStores);
export default updateStoresEvent;

export const invokeUpdateStores = UpdateStores;
