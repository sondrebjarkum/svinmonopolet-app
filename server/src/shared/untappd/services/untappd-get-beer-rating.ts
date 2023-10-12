import axios from 'axios';
import { BaseService } from '../../baseservice';
import { logFetchError, logNeutral } from '../../logging';
import KeyProvider from '../../keyprovider';
import Endpoints from '../utils/url-builder';
import { UntappdErrors } from '../../../events/sync-beverages-with-untappd/services/sync-beverages-service';
import { Result } from '../interfaces/untappd';
import UntappdRequestBase from '../untappd-request-base';

class GetBeverageDetailsBase extends UntappdRequestBase {
  // rateLimitReached(triedKeys: number) {
  //   KeyProvider.switch();
  //   if (triedKeys >= KeyProvider.allKeys.length) {
  //     return true;
  //   }
  //   return false;
  // }

  async perform(untappdBeerId: string) {
    return await this.getBeerDetails(untappdBeerId);
  }

  async getBeerDetails(query: string) {
    // for (let triedKeys = 0; triedKeys < KeyProvider.allKeys.length + 1; triedKeys++) {
    do {
      const { clientId, clientSecret } = KeyProvider.currentKey;
      const url = Endpoints.Rating({ query, clientId, clientSecret });

      try {
        const response = await axios.get(url);
        const result = response.data.response as Result;
        return this.ok(result);
        //
      } catch (error: any) {
        const status = error?.response?.status;
        const message = error?.response?.statusText;

        if (status === 429) {
          logNeutral(
            `rate limit reached for key ${KeyProvider.currentKey.clientId.slice(
              0,
              10,
            )}[...], switching`,
          );
          KeyProvider.switch();
        } else {
          logFetchError(
            `BeerRating responed with status '${status}' and message '${message}', query: ${query}`,
          );
          return this.bad(`${UntappdErrors.Unhandled} in ${this.serviceName}`, status);
        }
      }
    } while (!KeyProvider.rateLimitReached());
    // }

    return this.bad(UntappdErrors.LimitReached);
  }
}

const GetBeverageDetails = new GetBeverageDetailsBase();
export default GetBeverageDetails;
