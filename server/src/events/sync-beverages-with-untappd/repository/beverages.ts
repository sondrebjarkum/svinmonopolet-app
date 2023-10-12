import { prisma } from '../../../db';
import { BaseService } from '../../../shared/baseservice';
import { logInfo } from '../../../shared/logging';

export enum SyncBeveragesActions {
  SyncAll, // Syncer ALT på nytt - kanskje kjøre denne om det ikke er noen øl i db?
  NotSynced, // Gjerne nye øl som ikke er syncet - for routine sync
  Unsyncables, // Kun de som har feilet syncing
}

export enum SyncBeveragesCategories {
  Beers = 'beers',
  Meads = 'meads',
  Ciders = 'ciders',
  Non = 'nonalcoholics',
  // TODO: All = 'all'
}

class GetBeveragesBase extends BaseService {
  /**
   * Fungerer som en filter mot prisma for Sync beverages with untappd.
   * Kan da dynamisk peke til hvilken tabell/kategori som skal hentes fra.
   * Skal kunne ta inn kategori (mjød, øl, cider eller alkofri) og vil da si til prisma "hent denne kategorien".
   * @param param0
   * @returns
   */
  async perform({
    action,
    category,
  }: {
    action: SyncBeveragesActions;
    category?: Partial<SyncBeveragesCategories>;
  }) {
    const operation = this.handler()[action];

    if (!operation) return this.bad('nope');

    const res = await operation(category ?? SyncBeveragesCategories.Beers);

    if (res === 'category not implemented') {
      return this.bad(res);
    }

    if (!res) {
      return this.bad(`something went wrong in ${this.serviceName}`);
    }

    return this.ok(res);
  }

  handler = () => [this.GetAll, this.NotSynced, this.Unsyncables];

  async GetAll(category: Partial<SyncBeveragesCategories>) {
    if (category === 'meads' || category === 'ciders' || category === 'nonalcoholics')
      return 'category not implemented';

    return await prisma[`${category}`].findMany();
  }

  async NotSynced(category: Partial<SyncBeveragesCategories>) {
    if (category === 'meads' || category === 'ciders' || category === 'nonalcoholics')
      return 'category not implemented';

    return await prisma[`${category}`].findMany({
      where: {
        untappd_rating: null,
        error: null,
      },
    });
  }

  async Unsyncables(category: Partial<SyncBeveragesCategories>) {
    if (category === 'meads' || category === 'ciders' || category === 'nonalcoholics')
      return 'category not implemented';

    return await prisma[`${category}`].findMany({
      where: {
        error: { contains: 'No search result from Untappd for query' },
      },
    });
  }
}

const GetBeverages = new GetBeveragesBase();
export default GetBeverages;
