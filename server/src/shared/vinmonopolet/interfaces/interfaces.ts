export interface StoreDetailsResponse {
  storeId: string;
  storeName: string;
  status: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    gpsCoord: string;
    globalLocationNumber: string;
    organisationNumber: string;
  };
  telephone: string;
  email: string;
  category: string;
  profile: string;
  storeAssortment: string;
  openingHours: {
    regularHours: {
      validFromDate: string;
      dayOfTheWeek: string;
      openingTime: string;
      closingTime: string;
      closed: boolean;
    }[];
    exceptionHours: {
      date: string;
      openingTime: string;
      closingTime: string;
      message: string;
      closed: boolean;
    }[];
  };
  lastChanged: {
    date: string;
    time: string;
  };
}
