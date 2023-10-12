//I vinmonopolet.js
//updateRoutine: sammensetning av kall for å bygge opp DB
//cron.scheduale, sched task som kjører updateRoutine og en for updateLeastRated
//least rated er øl som har få ratings som kan endre seg fort i score

import { logCustom, FontColors, logDone } from '../shared/logging';
import { addNewStoresJob } from './add-new-stores';
import { dailyRoutineJob } from './daily-sync-routine';

//teknologier:
// www.npmjs.com/package/node-schedule - for å kjøre schedualed tasks

/**
 * Register all scheduled jobs
 */
const scheduled = {
  register: () => {
    logCustom('Scheduled Jobs', 'Registering scheduled jobs', FontColors.Muted);
    dailyRoutineJob();
    addNewStoresJob();
    logDone('📅 scheduled jobs registered');
  },
};
export default scheduled;
