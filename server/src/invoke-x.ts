import readline from 'readline';
import {
  FontColors,
  logCustom,
  logDone,
  logInfo,
  logNeutral,
  logNewLine,
  logWarning,
} from './shared/logging';
import { invokeUpdateStock } from './events/update-stock';
import { invokeUpdateStores } from './events/update-stores';
import { UpdateBeveragesEvent } from './events/update-beverages';
import VinmonopoletRepository from './shared/vinmonopolet/repositories/vinmonopolet-repository';
import SyncUncsyncables from './services/sync-failed-beverages-service';
import BeverageNameExtractor from './shared/openai/services/beverage-name-extractor';
import WriteBeerNameScoreToFile from './services/beverage-names-string-compare-score';
import { formatVinmnopoletBeerName } from './shared/untappd/utils/format-search-name';
import CompareBeverageNames from './services/compare-beverage-names';
import EventBus from './event-bus/event-bus';
import { EVENTS } from './shared/events';
import {
  SyncBeveragesActions,
  SyncBeveragesCategories,
} from './events/sync-beverages-with-untappd/repository/beverages';

enum CommandList {
  'update-stock' = '@event update Stock',
  'update-stores' = '@event update Stores',
  'update-beverages' = '@event update Beverages',
  'sync-with-untappd' = '@event sync Beverages with untappd',
  'update-unsyncables' = '@event sync Unsyncable Beverages',
  'extract-beer-names-classic' = '@util extract Beverage name classic',
  'write-beer-name-score-to-file' = '@util write Beers name accuracy to file',
  'write-beer-name-score-to-file-new' = '@util write Beers name accuracy to file *new*',
  'get-stores-repo' = '@service get Stores from Vinmonopolet',
  'extract-beer-names' = '@service extract Beverage name with AI',
  'exit-invoke' = 'cancel',
}

const getCommandByValue = (value: string): keyof typeof CommandList | undefined =>
  (Object.keys(CommandList) as Array<keyof typeof CommandList>).find(
    (key) => CommandList[key] === value,
  );

const CommandHandler = {
  [CommandList['extract-beer-names']]: async () =>
    await BeverageNameExtractor.perform(
      'Amundsen Bourbon Barrel Aged Sticky Little Fingers Ultra Pastry Stout',
    ),
  [CommandList['extract-beer-names-classic']]: async () =>
    await formatVinmnopoletBeerName('Trillium Fated Farmer Chardonnay BA Wild Ale'),
  [CommandList['write-beer-name-score-to-file']]: async () =>
    await WriteBeerNameScoreToFile.perform(),
  [CommandList['write-beer-name-score-to-file-new']]: async () =>
    await CompareBeverageNames.perform(),
  [CommandList['sync-with-untappd']]: async () =>
    EventBus.publish(EVENTS.SYNC_BEVERAGES_WITH_UNTAPPD, {
      action: SyncBeveragesActions.NotSynced,
      category: SyncBeveragesCategories.Beers, //TODO: skal kalle på "All"
    }),
  [CommandList['update-unsyncables']]: async () => await SyncUncsyncables.perform(),
  [CommandList['update-stock']]: async () => await invokeUpdateStock.perform(),
  [CommandList['update-stores']]: async () => await invokeUpdateStores.perform(),
  [CommandList['update-beverages']]: async () => await UpdateBeveragesEvent.invoke(),
  [CommandList['get-stores-repo']]: async () => await VinmonopoletRepository.getStores(),
  [CommandList['exit-invoke']]: () => {
    logNeutral('exiting invoke...');
  },
};

const { Select } = require('enquirer');

function setupKeypressListener() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.once('keypress', (str, key) => {
    if (key.name === 'i') {
      runCommand();
    }
  });

  process.stdin.on('data', (data) => {
    if (data.toString() === '\u0003') {
      console.log('Exiting...');
      process.exit();
    }
  });
}

async function invoker(command: CommandList) {
  try {
    if (command == 'cancel') {
      return true;
    }
    logNewLine(2);
    logCustom('Invoker', `invoking ${getCommandByValue(command)}`, FontColors.Blue);
    const done = await CommandHandler[command]();

    if (done) {
      logNewLine();
      logNeutral('------------------- invoke result -------------------');
      console.log(done);
      logNeutral('------------------- end of result -------------------');
      logNewLine(2);
      return true;
    }
    return true;
  } catch (error) {
    console.error(error);
    logWarning(`Something went wrong invoking '${command}'`);
    return true;
  }
}

function runCommand() {
  const prompt = new Select({
    name: 'invoke',
    message: 'Which event do you want to invoke?',
    choices: Object.values(CommandList),
  });
  prompt
    .run()
    .then(async (answer: string) => {
      const handled = await invoker(answer as CommandList);
      if (handled) {
        setupKeypressListener();
      }
    })
    .finally(() => {
      prompt.close();
    })
    .catch(console.error);
}

// export { setupKeypressListener };
const Invoker = {
  start: () => setupKeypressListener(),
};
export default Invoker;
