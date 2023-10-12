import { writeFile } from 'fs';
import { BaseService } from '../shared/baseservice';
import { prisma } from '../db';
import { logService, logDone } from '../shared/logging';
import {
  formatVinmnopoletBeerName,
  formatVinmnopoletBeerNameNew,
} from '../shared/untappd/utils/format-search-name';

class CompareBeverageNamesBase extends BaseService {
  async perform() {
    logService(`Starting ${this.serviceName}`);
    try {
      const beverages = await prisma.beers.findMany({
        where: {
          untappd_bid: {
            not: null,
          },
        },
      });
      const results = beverages.map((bev) => {
        const vmp_name = bev.vmp_name as string;
        const untappd_name = `${bev.untappd_brewery} ${bev.untappd_name}`;
        return {
          vmp_name: formatVinmnopoletBeerNameNew(vmp_name),
          untappd_name,
          score: compareStrings(vmp_name, untappd_name),
        };
      });
      results.sort((a, b) => a.score - b.score);
      writeFile('./compare-names-result.json', JSON.stringify(results), (err) => {
        if (err) {
          console.error(err);
        }
        logDone('Results written to compare-names-result.json');
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export function compareStrings(a: string, b: string) {
  const words1 = a.toLowerCase().split(' ');
  const words2 = b.toLowerCase().split(' ');

  const matchingWords = words1.filter((word) => words2.includes(word));

  const percentage = (matchingWords.length / words1.length) * 100;

  return percentage;
}

const CompareBeverageNames = new CompareBeverageNamesBase();
export default CompareBeverageNames;
