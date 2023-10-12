import axios, { AxiosRequestConfig } from 'axios';
import vinmonopolet from 'vinmonopolet';
import Constants from '../constants/paths';
import { StoreDetailsResponse } from '../interfaces/interfaces';
export interface VinmonopoletProduct {
  code: number;
  name: string;
  images: {
    url: string;
  }[];
  price: number;
  containerSize: number;
  barcode: number;
}
export enum Facets {
  BEER = 'BEER',
  CIDER = 'CIDER',
  MEAD = 'MEAD',
  ALCOHOL_FREE = 'ALCOHOL_FREE',
}
class VinmonopoletRepositoryBase {
  getProducts = async (facet: Facets) => {
    let { pagination, products }: { pagination: any; products: VinmonopoletProduct[] } =
      await vinmonopolet.getProducts({
        facet: vinmonopolet.Facet.Category[facet],
      });

    while (pagination.hasNext) {
      const response = await pagination.next();
      products = products.concat(response.products);
      pagination = response.pagination;
    }
    return products;
  };

  getStores = async () => {
    try {
      const response = await axios.get<StoreDetailsResponse[]>(
        `${Constants.BaseUrl}/stores/v0/details`,
        {
          headers: {
            ...Constants.Headers.auth,
            ...Constants.Headers.content,
          },
        },
      );

      const stores = response.data;

      return stores;
    } catch (error) {
      console.error(error);
    }
  };
}

const VinmonopoletRepository = new VinmonopoletRepositoryBase();
export default VinmonopoletRepository;
