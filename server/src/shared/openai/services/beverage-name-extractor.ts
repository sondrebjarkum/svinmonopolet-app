import { BaseService } from '../../baseservice';
import { Configuration, OpenAIApi } from 'openai';
import { logError, logNeutral } from '../../logging';

const configuration = new Configuration({
  organization: 'org-XAmodonOEzYydmK83xccmIo4',
  apiKey: process.env.OPENAI,
});

class BeverageNameExtractorBase extends BaseService {
  openai = new OpenAIApi(configuration);

  async perform(prompt: string) {
    const input_text = prompt;
    try {
      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Extract the brewery, beer name without beer style (like Stout, IPA, Pale Ale) UNLESS the beer style is before the beer name, and additional information from the following input text, return JUST a JSON response: "${input_text}".`,
        // prompt: `Extract the brewery and beer name from the following input text. Include any beer style or descriptors that come before the beer name, but exclude any beer styles or descriptors that come after the beer name, as well as any other descriptors that appear after the detected beer name but before the end of the sentence, return JUST a JSON response: ${input_text}`,
        max_tokens: 1024,
        n: 1,
        stop: null,
        temperature: 0.2,
      });

      const extracted_text = response?.data?.choices[0]?.text?.trim();

      if (!extracted_text) {
        logError('No result from prompt');
        return;
      }

      console.log('extracted_text:', extracted_text);
      const object: { brewery: string; beerName: string } = JSON.parse(extracted_text);
      logNeutral(`AI search object:`);
      console.log(object);
      if (!object) {
        return '';
      }
      return `${object.brewery} ${object.beerName}`;

      // const [brewery, beer_name, additional_info] = extracted_text
      //   .split('\n')
      //   .map((s: any) => s.split(':')[1].trim());

      // const query = brewery ? `${brewery} ${beer_name}` : '';

      // logNeutral(`AI search string: "${query}"`);

      // return query;
    } catch (error) {
      console.error(error);
      return '';
    }
  }
}

const BeverageNameExtractor = new BeverageNameExtractorBase();
export default BeverageNameExtractor;
