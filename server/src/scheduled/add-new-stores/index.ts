import { scheduleJob } from 'node-schedule';
import EventBus from '../../event-bus/event-bus';
import { EVENTS } from '../../shared/events';
import { logCustom, FontColors, logInfo } from '../../shared/logging';

/**
 * Job som kjører 00:00 den 1 hver måned.
 * Henter alle Vinmonopolet-butikker og legger de til om noen.
 * Relativt unødvendig, men plutselig er det jo en ny butikk der ute!
 */
const addNewStoresJob = () => {
  logCustom('  registered', `NewStoresJob`, FontColors.Muted, false);
  return scheduleJob('0 0 1 * *', async function (fireDate) {
    logInfo(`Starting New Stores Job @${fireDate.toDateString()}...`);
    EventBus.publish(EVENTS.UPDATE_STORES);
  });
};

const addNewStoresInvoke = async () => {
  EventBus.publish(EVENTS.UPDATE_STORES);
};

export { addNewStoresJob, addNewStoresInvoke };
