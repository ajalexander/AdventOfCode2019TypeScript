import { DayChallenge } from '../common/dayChallenge';
import { FileReader } from '../common/fileUtils';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

export class Solution extends DayChallenge {
  private lines: string[];

  private static parseEntry(dataRow: string) {

    const expression = /(\d+)-(\d+) (\w): (.*)+/;
    const result = dataRow.match(expression);

    const lowNumber = parseInt(result[1]);
    const highNumber = parseInt(result[2]);
    const targetCharacter = result[3];
    const password = result[4];

    return {
      lowNumber,
      highNumber,
      targetCharacter,
      password,
    }
  }

  private static isPasswordValidForFirstRuleset(dataRow: string) {
    const parsed = Solution.parseEntry(dataRow);

    const occurrences = parsed.password.split(parsed.targetCharacter).length - 1;

    return (occurrences >= parsed.lowNumber) && (occurrences <= parsed.highNumber);
  }

  private static isPasswordValidForSecondRuleset(dataRow: string) {
    const parsed = Solution.parseEntry(dataRow);

    const firstMatch = parsed.password[parsed.lowNumber - 1] === parsed.targetCharacter;
    const secondMatch = parsed.password[parsed.highNumber - 1] === parsed.targetCharacter;

    return (firstMatch && !secondMatch) || (!firstMatch && secondMatch);
  }

  constructor() {
    super();
    const reader = new FileReader();
    this.lines = reader.readFile(inputPath);
  }

  dayNumber(): number {
    return 2;
  }

  partOne(): void {
    const validPasswords = this.lines.map(Solution.isPasswordValidForFirstRuleset).filter(Boolean).length;
    console.log(`There are ${validPasswords} valid passwords`);
  }

  partTwo(): void {
    const validPasswords = this.lines.map(Solution.isPasswordValidForSecondRuleset).filter(Boolean).length;
    console.log(`There are ${validPasswords} valid passwords`);
  }
}
