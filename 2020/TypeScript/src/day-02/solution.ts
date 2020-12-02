import { DayChallenge } from '../common/dayChallenge';
import { problemInputs } from './data';

const input = problemInputs;

export class Solution extends DayChallenge {
  private isPasswordValid(dataRow: string) {
    const expression = /(\d+)-(\d+) (\w): (.*)+/;
    const result = dataRow.match(expression);

    const minimumOccurrences = parseInt(result[1]);
    const maximumOccurrences = parseInt(result[2]);
    const targetCharacter = result[3];
    const password = result[4];

    const occurrences = password.split(targetCharacter).length - 1;

    // console.log(minimumOccurrences, maximumOccurrences, targetCharacter, password, occurrences);

    return (occurrences >= minimumOccurrences) && (occurrences <= maximumOccurrences);
  }

  private findValidPasswordIndices(data: string[]) : number[] {
    const indices: number[] = [];

    data.forEach((dataRow, index) => {
      if (this.isPasswordValid(dataRow)) {
        indices.push(index);
      }
    });

    return indices;
  }

  dayNumber(): number {
    return 1;
  }
  partOne(): void {
    const validPasswordIndices = this.findValidPasswordIndices(input);
    console.log(`There are ${validPasswordIndices.length} valid passwords`);
  }

  partTwo(): void {
  }
}
