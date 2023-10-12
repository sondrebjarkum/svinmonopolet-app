// import { prisma } from '../../../db';
// import { BaseService } from '../../../shared/baseservice';
// import { logInfo } from '../../../shared/logging';

// export enum SyncActions {
//   SyncAll, // Syncer ALT på nytt - kanskje kjøre denne om det ikke er noen øl i db?
//   NotSynced, // Gjerne nye øl som ikke er syncet - for routine sync
//   Unsyncables, // Kun de som har feilet syncing
// }

// export enum SyncCategories {
//   Beers = 'beers',
//   Meads = 'meads',
//   Ciders = 'ciders',
//   Non = 'nonalcoholics',
//   // TODO: All = 'all'
// }

// class UntappdSyncFilterBase extends BaseService {
//   /**
//    * Fungerer som en filter mot prisma for Sync beverages with untappd.
//    * Kan da dynamisk peke til hvilken tabell/kategori som skal hentes fra.
//    * Skal kunne ta inn kategori (mjød, øl, cider eller alkofri) og vil da si til prisma "hent denne kategorien".
//    * @param param0
//    * @returns
//    */
//   async perform({
//     action,
//     category,
//   }: {
//     action: SyncActions;
//     category?: Partial<SyncCategories>;
//   }) {
//     // return this.handler(category ?? GetBeveragesCategories.Beers)[action];
//     const operation = this.handler(category ?? SyncCategories.Beers)[action];
//     if (!operation) return this.bad('nope');
//     const res = await operation(category ?? SyncCategories.Beers);
//     if (res === 'category not implemented') {
//       return this.bad('category not implemented');
//     }
//     if (!res) {
//       return this.bad('mordi');
//     }
//     return this.ok(res);
//   }

//   handler = (category: Partial<SyncCategories>) => [
//     this.GetAll,
//     this.NotSynced,
//     this.Unsyncables,
//   ];

//   async GetAll(category: Partial<SyncCategories>) {
//     logInfo('GetAll fired');
//     if (
//       category === 'meads' ||
//       category === 'ciders' ||
//       category === 'nonalcoholics'
//     )
//       return 'category not implemented';

//     return await prisma[`${category}`].findMany();
//   }

//   async NotSynced(category: Partial<SyncCategories>) {
//     // logInfo('NotSynced fired');

//     if (
//       category === 'meads' ||
//       category === 'ciders' ||
//       category === 'nonalcoholics'
//     )
//       return 'category not implemented';

//     return await prisma[`${category}`].findMany({
//       where: {
//         untappd_rating: { in: ['', '0'] },
//       },
//     });
//   }

//   async Unsyncables(category: Partial<SyncCategories>) {
//     logInfo('Unsyncables fired');

//     if (
//       category === 'meads' ||
//       category === 'ciders' ||
//       category === 'nonalcoholics'
//     )
//       return 'category not implemented';

//     return await prisma[`${category}`].findMany({
//       where: {
//         data: { contains: 'No search result from Untappd for query' },
//       },
//     });
//   }
// }

// const UntappdSyncFilter = new UntappdSyncFilterBase();
// export default UntappdSyncFilter;
