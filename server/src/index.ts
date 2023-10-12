import events from './events';
import Invoker from './invoke-x';
import scheduled from './scheduled';
import { dailyRoutineInvoke } from './scheduled/daily-sync-routine';
import { logNewLine, logInfo, logAppReady, logAppInit } from './shared/logging';
import dotenv from 'dotenv';

// setup env variables
dotenv.config();

logNewLine(2);

/**
 * Første kjøring, populer med VM data
 * 1. oppdater Stores -vm
 * 2. oppdater Beverages -vm
 * 3. oppdater Stock -vm
 * 4. begynn å synce beverages med untappd
 * nå skal databasen være initialized, skal ha all vinmonopolet data og kan begynne å synce med untappd
 *
 * scheduled
 * 1. som scheduled job hver dag vil jeg kjøre "oppdater Beverages" for å finne nye øl hos VM
 * 2. når den er ferdig sender den event til "oppdater Stock"       ┐
 * !                                                                  -> kan disse kjøre samtidig?
 * 3. når den er ferdig sender den event for å "synce med untappd"  ┘
 */

const dailyRutine = async () => {
  logInfo('skipping initial setup, going straight for daily sync routine');

  await dailyRoutineInvoke();
};

const register = () => {
  events.register();
  scheduled.register();
};

const run = async () => {
  logAppInit();
  register();
  logAppReady();

  const args = process.argv;
  if (args.includes('--setup-only')) {
    // does not run any event or task, just reigsters them
    // basically prepares server for invoke
    Invoker.start();
    return;
  }
  if (args.includes('--daily-routine')) {
    //forces start of the midnight sched
    //runs through udate-beverages -> update-stores -> update-stock -> sync-with-untappd
    await dailyRutine();
    return;
  }
};

void run();
