import EventBus from '../../event-bus/event-bus';
import { EVENTS } from '../../shared/events';
import UpdateBeverages from './services/update-beverages-from-vinmonopolet';

const updateBeveragesEvent = () =>
  EventBus.subscribe([EVENTS.UPDATE_BEVERAGES], UpdateBeverages);
export default updateBeveragesEvent;

export const invokeUpdateBeverages = UpdateBeverages;

export const UpdateBeveragesEvent = {
  register: () => EventBus.subscribe([EVENTS.UPDATE_BEVERAGES], UpdateBeverages),
  invoke: async () => await UpdateBeverages.perform(),
};
