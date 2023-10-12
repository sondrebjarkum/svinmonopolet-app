import {
  logError,
  logEvent,
  logInfo,
  logNeutral,
  logNewLine,
  logUntappd,
} from './logging';

/**
 * TODO: skriv om denne til å være mer dynamisk?
 * i .env setter man UNTAPPD_CLIENT_ID_x etc
 * bruk en for loop for å hente alle nøkler (man kan da legge til så mange man har)
 * sjekk om _CLIENT_ID_[i] faktisk returnerer noe, ellers så er det ikke flere keys
 */

export type Key = {
  clientId: string;
  clientSecret: string;
};

export const key1: Key = {
  clientId: process.env.UNTAPPD_CLIENT_ID ?? '[not_found]',
  clientSecret: process.env.UNTAPPD_CLIENT_SECRET ?? '[not_found]',
} as const;

export const key2: Key = {
  clientId: process.env.UNTAPPD_CLIENT_ID_2 ?? '[not_found]',
  clientSecret: process.env.UNTAPPD_CLIENT_SECRET_2 ?? '[not_found]',
} as const;

class KeyProviderImp {
  currentKey = key1;
  allKeys: Key[] = [key1, key2];
  triedKeys: Key[] = [];

  rateLimitReached() {
    const allKeysTried = this.allKeys.every((key) =>
      this.triedKeys.some((tkey) => tkey.clientSecret === key.clientSecret),
    );
    if (allKeysTried) {
      return true;
    }
    return false;
  }

  reset() {
    this.currentKey = key1;
    this.triedKeys = [];
  }

  switch() {
    logNewLine();
    logUntappd('Switching key');
    logNeutral(`previous key: ${KeyProvider.currentKey.clientId}`);
    this.triedKeys.push(this.currentKey);

    switch (this.currentKey.clientId) {
      case key1.clientId:
        this.currentKey = key2;
        break;
      case key2.clientId:
        this.currentKey = key1;
        break;
      default:
        logError('something went wrong while switching keys');
    }
    logNeutral(`new key: ${KeyProvider.currentKey.clientId}`);
    logNewLine();
  }
}
const KeyProvider = new KeyProviderImp();
export default KeyProvider;

// const keyProvider = (currentKey?: Key) => {
//   if (!currentKey) return key1;

//   const newKey = (() => {
//     switch (currentKey.clientId) {
//       case process.env.UNTAPPD_CLIENT_ID:
//         return key2;
//       case process.env.UNTAPPD_CLIENT_ID_2:
//         return key1;
//       default:
//         logError('something went wrong with keys');
//         return { clientId: 'error', clientSecret: 'error' };
//     }
//   })();

//   return newKey;
// };
