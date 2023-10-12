import EventLock from '../event-bus/event-lock';
import { FontColors, logCustom, logNewLine } from './logging';

export abstract class BaseService {
  skipped = 0; //for logResult
  added = 0; //for logResult
  updated = 0; //for logResult
  total = 0;
  customResultTypes: Array<{ [key: string]: number }> = [];
  type = '[type]';
  serviceName = '[servicename]';
  result = {
    added: () => (this.added = this.added + 1),
    skipped: () => (this.skipped = this.skipped + 1),
    updated: () => (this.updated = this.updated + 1),
    custom: (key: string) => {
      const obj = this.customResultTypes.find((e) => e.hasOwnProperty(key));
      if (obj) {
        obj[key]++;
      } else {
        const newObj = { [key]: 1 };
        this.customResultTypes.push(newObj);
        return newObj;
      }
    },
  };
  constructor() {
    this.serviceName = this.constructor.name;
  }
  resetResults() {
    this.skipped = 0;
    this.added = 0;
    this.updated = 0;
    this.total = 0;
    this.customResultTypes = [];
  }
  lock() {
    EventLock.lock(this.serviceName);
  }
  unlock() {
    EventLock.unlock(this.serviceName);
  }
  locked() {
    return EventLock.isLocked(this.serviceName);
  }
  abstract perform(args: unknown): any;

  ok<T>(data: T, code?: number) {
    return [true, data, code] as [boolean, T, number];
  }

  bad<T>(data: T, code?: number) {
    return [false, data, code] as [boolean, T, number];
  }

  logResult() {
    logNewLine();
    logCustom('Results', this.serviceName, FontColors.Muted);
    logCustom(
      '  added  ',
      `${this.added} ${this.type} of ${this.total} total fetched.`,
      FontColors.Green,
    );
    logCustom(
      '  updated',
      `${this.updated} ${this.type} of ${this.total} total fetched.`,
      FontColors.Magenta,
    );
    logCustom(
      '  skipped',
      `${this.skipped} ${this.type} of ${this.total} total fetched`,
      FontColors.Red,
    );
    if (this.customResultTypes.length > 0) {
      this.customResultTypes.forEach((crt) => {
        for (const key in crt) {
          const value = crt[key];
          logCustom(
            `  ${key}`,
            `${value} ${this.type} of ${this.total} total fetched`,
            FontColors.Muted,
          );
        }
      });
    }
    logNewLine();
  }
}
