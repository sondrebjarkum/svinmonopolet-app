import { BaseService } from '../baseservice';
import KeyProvider, { Key } from '../keyprovider';

abstract class UntappdRequestBase extends BaseService {
  // rateLimitReached() {
  //   if (this.triedKeys.length > 1) {
  //     return true;
  //   }
  //   this.triedKeys.push(KeyProvider.currentKey);
  //   KeyProvider.switch();
  //   return false;
  // }
}
export default UntappdRequestBase;
