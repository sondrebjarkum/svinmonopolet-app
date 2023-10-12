import GetBeverageDetails from './services/untappd-get-beer-rating';
import SearchBeer from './services/untappd-search-beer';
import { formatVinmnopoletBeerName } from './utils/format-search-name';

export const Untappd = {
  SearchBeer,
  GetBeverageDetails,
  Utils: {
    formatVinmnopoletBeerName,
  },
};
