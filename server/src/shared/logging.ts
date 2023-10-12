export function logAppReady() {
  logNewLine(3);
  console.log(`\x1b[32m%s\x1b[0m \x1b[37m\x1b[2mFirst time set-up done\x1b[0m `, '✓');
  console.log(`\x1b[31m%s\x1b[0m Svinmonopolet ready!`, '❤︎');
  logNewLine();
}

export function logAppInit() {
  console.log(`------ \x1b[32m%s\x1b[0m ------ `, 'Starting Svinmonopolet server 🐷');
  logNewLine();
}

export function logNewLine(x = 1) {
  for (let i = 0; i < x; i++) {
    console.log(' ');
  }
}
export function logInfo(s: string) {
  console.log(
    //blue
    `\x1b[34m%s\x1b[0m - ${s}`,
    'info',
  );
}
export function logDone(s: string) {
  console.log(
    //green
    `\x1b[32m%s\x1b[0m - ${s}`,
    'done',
  );
  logNewLine();
}

export function logEvent(s: string) {
  console.log(
    //pink
    `\x1b[35m%s\x1b[0m - ${s}`,
    'event',
  );
}

export function logError(s: string) {
  console.log(
    //red
    `\x1b[31m%s\x1b[0m - ${s}`,
    'error',
  );
}

export function logLimitReached() {
  const timestamp = `${FontColors.BoldStart}${new Date().toLocaleString('no-NO', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  })}${FontColors.BoldEnd}`;

  logNewLine(2);
  logUntappd(`rate limit reached at ${timestamp} `);
  logNeutral("Timeout for 1 hour while Untappd gets it's s**t together... 🤡");
}

export function logStartSync(beverages: string, action: string, category: string) {
  logNewLine(2);
  logUntappd(
    'Syncing 🍻beverages🍻 with Untappd! Lean back, grab a beer, this might take while... 🧘‍♂️',
  );
  logNewLine(1);
  logNeutral(
    `----- Retrieved ${beverages} unsynced beverages from database, beginning sync with ${action}:${category} -----`,
  );
  logNewLine(2);
}

export function logFetchError(s: string) {
  console.log(`${FontColors.Red} - ${s}`, 'fetch');
}

export function logWarning(s: string) {
  console.log(`${FontColors.Orange} - ${s}`, 'warning');
}

export function logNeutral(s: string) {
  logCustom(s, ``, FontColors.Muted, false);
}
export function logService(s: string) {
  logCustom('service', s, FontColors.Muted);
}

export function logUntappd(s: string) {
  logCustom('untappd', s, FontColors.Yellow);
}

export enum FontColors {
  Black = '\x1b[30m%s\x1b[0m',
  Red = '\x1b[31m%s\x1b[0m',
  Orange = '\x1b[38;5;208m%s\x1b[0m',
  Green = '\x1b[32m%s\x1b[0m',
  Yellow = '\x1b[33m%s\x1b[0m',
  Blue = '\x1b[34m%s\x1b[0m',
  Magenta = '\x1b[35m%s\x1b[0m',
  Cyan = '\x1b[36m%s\x1b[0m',
  White = '\x1b[37m%s\x1b[0m',
  Muted = '\x1b[37m\x1b[2m%s\x1b[0m',
  BoldStart = '\x1b[1m',
  BoldEnd = '\x1b[0m',
}

export function logCustom(
  event: string,
  message: string,
  fontcolor: FontColors,
  hyphen = true,
) {
  const h = hyphen ? '-' : '';
  console.log(`${fontcolor} ${h} ${message}`, `${event}`);
}
