interface Payload {
  query: string;
  clientId: string;
  clientSecret: string;
}

const baseURL = 'https://api.untappd.com/v4';
const auth = (ci: string, cs: string) => `?client_id=${ci}&client_secret=${cs}`;

const searchBeerUrl = ({ query, clientId, clientSecret }: Payload) =>
  `${baseURL}/search/beer${auth(clientId, clientSecret)}&q=${encodeURIComponent(
    query,
  )}`;

const beerRatingUrl = ({ query: beerId, clientId, clientSecret }: Payload) =>
  `${baseURL}/beer/info/${encodeURIComponent(beerId)}${auth(
    clientId,
    clientSecret,
  )}`;

const Endpoints = { Search: searchBeerUrl, Rating: beerRatingUrl };

export default Endpoints;
