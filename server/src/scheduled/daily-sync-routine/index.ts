import { scheduleJob } from 'node-schedule';
import EventBus from '../../event-bus/event-bus';
import { EVENTS } from '../../shared/events';
import { logCustom, FontColors, logInfo } from '../../shared/logging';
import {
  SyncBeveragesActions,
  SyncBeveragesCategories,
} from '../../events/sync-beverages-with-untappd/repository/beverages';

/**
 * Job som kjører 00:15 hver dag.
 * Sender bare ut eventet for update-beverages som henter
 * alle drikker fra Vinmonopolet og legger til i databasen
 */
const dailyRoutineJob = () => {
  logCustom('  registered', `updateAndSyncBeveragesJob`, FontColors.Muted, false);
  return scheduleJob('15 0 * * *', async function (fireDate) {
    logInfo(`Starting Routine Sync Job @${fireDate.toDateString()}...`);
    EventBus.publish(EVENTS.UPDATE_BEVERAGES, {
      action: SyncBeveragesActions.NotSynced,
      category: SyncBeveragesCategories.Beers, //TODO: skal kalle på "All"
    });
  });
};

const dailyRoutineInvoke = async () => {
  EventBus.publish(EVENTS.UPDATE_BEVERAGES, {
    action: SyncBeveragesActions.NotSynced,
    category: SyncBeveragesCategories.Beers, //TODO: skal kalle på "All"
  });
};

export { dailyRoutineJob, dailyRoutineInvoke };
