import EventBus from '../../event-bus/event-bus';
import { EVENTS } from '../../shared/events';
import UpdateStockService from './services/update-stock';

const updateStockEvent = () =>
  EventBus.subscribe(EVENTS.UPDATE_STOCK, UpdateStockService);
export default updateStockEvent;

export const invokeUpdateStock = UpdateStockService;
