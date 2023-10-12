import { prisma } from '../db';
import { BaseService } from '../shared/baseservice';
import { writeFile } from 'fs';
import { logDone, logService } from '../shared/logging';

function getSimilarityPercentage(str1: string, str2: string): number {
  const jaroDistance = getJaroWinklerDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const similarityPercentage = Math.round(jaroDistance * 100 * maxLength) / maxLength;
  return similarityPercentage;
}

function getJaroWinklerDistance(str1: string, str2: string): number {
  const threshold = 0.7;
  const winklerBonus = 0.1;

  const jaroDistance = calculateJaroDistance(str1, str2);
  let commonPrefixLength = 0;
  for (let i = 0; i < Math.min(4, str1.length, str2.length); i++) {
    if (str1.charAt(i) === str2.charAt(i)) {
      commonPrefixLength++;
    } else {
      break;
    }
  }
  const jaroWinklerDistance =
    jaroDistance + commonPrefixLength * winklerBonus * (1 - jaroDistance);
  return jaroWinklerDistance >= threshold ? jaroWinklerDistance : 0;
}

function calculateJaroDistance(str1: string, str2: string): number {
  const matchingDistance = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
  const str1Matches = new Array(str1.length).fill(false);
  const str2Matches = new Array(str2.length).fill(false);

  let matchingCharacters = 0;
  for (let i = 0; i < str1.length; i++) {
    const startIndex = Math.max(0, i - matchingDistance);
    const endIndex = Math.min(i + matchingDistance + 1, str2.length);
    for (let j = startIndex; j < endIndex; j++) {
      if (!str2Matches[j] && str1.charAt(i) === str2.charAt(j)) {
        str1Matches[i] = true;
        str2Matches[j] = true;
        matchingCharacters++;
        break;
      }
    }
  }
  if (matchingCharacters === 0) {
    return 0;
  }
  const transpositions = countTranspositions(str1, str2, str1Matches, str2Matches);
  const jaroDistance =
    (matchingCharacters / str1.length +
      matchingCharacters / str2.length +
      (matchingCharacters - transpositions) / matchingCharacters) /
    3;
  return jaroDistance;
}

function countTranspositions(
  str1: string,
  str2: string,
  str1Matches: boolean[],
  str2Matches: boolean[],
): number {
  let transpositions = 0;
  let lastMatchIndex = -1;
  for (let i = 0; i < str1.length; i++) {
    if (str1Matches[i]) {
      while (!str2Matches[++lastMatchIndex]) {}
      if (str1.charAt(i) !== str2.charAt(lastMatchIndex)) {
        transpositions++;
      }
    }
  }
  return transpositions / 2;
}

class WriteBeerNameScoreToFileBase extends BaseService {
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
          vmp_name,
          untappd_name,
          score: getSimilarityPercentage(vmp_name, untappd_name),
        };
      });
      writeFile('./syncresult.json', JSON.stringify(results), (err) => {
        if (err) {
          console.error(err);
        }
        logDone('Results written to syncresult.json');
      });
    } catch (error) {
      console.error(error);
    }
  }
}

const WriteBeerNameScoreToFile = new WriteBeerNameScoreToFileBase();
export default WriteBeerNameScoreToFile;
