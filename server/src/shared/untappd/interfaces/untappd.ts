// RESULT FROM GETING A BEER WITH BID
export type BeerDetailsResult = {
  bid: number;
  beer_name: string;
  beer_label: string;
  beer_abv: number;
  beer_ibu: number;
  beer_description: string;
  beer_style: string;
  is_in_production: number;
  beer_slug: string;
  is_homebrew: number;
  created_at: string;
  rating_count: number;
  rating_score: number;
  stats: {
    total_count: number;
    monthly_count: number;
    total_user_count: number;
    user_count: number;
  };
};

export type Result = {
  beer: BeerDetailsResult;
};

// RESULT FROM SEARCHING BEER WITH NAME
export type UntappdBeer = {
  bid: number;
  beer_name: string;
  beer_label: string;
  beer_abv: number;
  beer_ibu: number;
  beer_description: string;
  created_at: string;
  beer_style: string;
  auth_rating: number;
  wish_list: boolean;
  in_production: number;
  rating_score: number;
  beer_slug: string;
};
export type UntappdBrewery = {
  brewery_id: number;
  brewery_name: string;
  brewery_slug: string;
  brewery_label: string;
  country_name: string;
  contact: {
    twitter: string;
    facebook: string;
    instagram: string;
    url: string;
  };
  location: {
    brewery_city: string;
    brewery_state: string;
    lat: number;
    lng: number;
  };
  brewery_active: number;
};

export type UntappdBeerResult = {
  checkin_count?: number;
  have_had?: boolean;
  your_count?: number;
  beer: UntappdBeer;
  brewery: UntappdBrewery;
};
export type BeerSearchResult = {
  found: number;
  offset: number;
  limit: number;
  term: string;
  parsed_term: string;
  beers: {
    count: number;
    items: UntappdBeerResult[];
  };
};
