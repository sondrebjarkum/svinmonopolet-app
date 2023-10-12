/* eslint-disable @typescript-eslint/ban-types */
// // https://medium.com/@ofir3322/add-your-own-type-definition-to-any-javascript-3rd-party-module-1fc6b11e6f10
// // https://medium.com/@steveruiz/using-a-javascript-library-without-type-declarations-in-a-typescript-project-3643490015f3
// // https://stackoverflow.com/questions/39109027/write-a-declaration-file-for-a-default-export-module - denne som fiksa
type OpeningHours = {
  opens: number;
  closes: number;
};
interface Store {
  name: string;
  streetAddress: string;
  streetZip: string;
  streetCity: string;
  postalAddress: string;
  postalZip: string;
  postalCity: string;
  phoneNumber: string;
  category: string;
  latitude: number;
  longitude: number;
  weekNumber: number;
  butikknummer: string;

  openingHoursMonday: OpeningHours;
  openingHoursTuesday: OpeningHours;
  openingHoursWednesday: OpeningHours;
  openingHoursThursday: OpeningHours;
  openingHoursFriday: OpeningHours;
  openingHoursSaturday: OpeningHours;
  weekNumberNext: number;
  openingHoursNextMonday: OpeningHours;
  openingHoursNextTuesday: OpeningHours;
  openingHoursNextWednesday: OpeningHours;
  openingHoursNextThursday: OpeningHours;
  openingHoursNextFriday: OpeningHours;
  openingHoursNextSaturday: OpeningHours;
}
declare module "vinmonopolet" {
  class vinmonopolet {
    // Models
    static Facet: {
      Category: {
        BEER;
        CIDER;
        SAKE;
        MEAD;
        ALCOHOL_FREE;
        RED_WINE;
        ROSE_WINE;
        WHITE_WINE;
        RIPPLING_WINE;
        FLAVORED_WINE;
        SPARKLING_WINE;
        FORTIFIED_WINE;
        FRUIT_WINE;
        LIQUOR;
      };
    };
    static Category: {};
    static FacetValue: {};
    static FoodPairing: {};
    static Pagination: {};
    static Product: {};
    static ProductImage: {};
    static ProductStatus: {
      ACTIVE: "active";
      OUT_OF_STOCK: "outOfStock";
      EXPIRED: "expired";
    };
    static RawMaterial: any;
    static Store: any;

    // Searchers
    static getFacets: () => Promise<any>;
    static getProducts: ({ ...args }) => Promise<any>;
    static getStores: (args?: unknown) => Promise<any>;
    static searchProducts: ({ ...args }) => Promise<any>;
    static getProduct: ({ ...args }) => Promise<any>;
    static getProductsById: ({ ...args }) => Promise<any>;
    static getProductsByStore: ({ ...args }) => Promise<any>;
    static getProductByBarcode: ({ ...args }) => Promise<any>;

    // Stream interface
    static stream: {
      getProducts: () => any;
      getStores: () => {
        on(event: string, callback?: (arg: T) => void);
      };
    };
  }

  export = vinmonopolet;
}
