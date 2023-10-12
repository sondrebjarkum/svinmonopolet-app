import { AxiosRequestConfig } from 'axios';

const BaseUrl = 'https://apis.vinmonopolet.no';

const Headers = {
  auth: {
    'Ocp-Apim-Subscription-Key': process.env.VINMONOPOLET_API_KEY,
  },
  content: {
    'Content-Type': 'application/json',
  },
};
const Constants = {
  BaseUrl,
  Headers,
};
export default Constants;
