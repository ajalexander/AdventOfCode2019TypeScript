import { DayChallenge } from '../common/dayChallenge';
import { FileReader } from '../common/fileUtils';

const inputPath = './src/day-04/problemInput.txt';

interface PassportFields {
  byr: string;
  iyr: string;
  eyr: string;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
  cid: string;
}

export class Solution extends DayChallenge {
  private lines: string[];

  private splitIntoGroups() {
    const groups = [];
    groups.push([]);

    this.lines.forEach(line => {
      if (line.match(/^\s*$/)) {
        groups.push([]);
      } else {
        groups[groups.length - 1].push(line);
      }
    });

    return groups;
  }

  private parsePassportData(data: string[]) {
    const parsedData = {} as PassportFields;

    data.forEach(dataLine => {
      dataLine.split(' ').forEach(dataElement => {
        const splitElement = dataElement.split(':');
        parsedData[splitElement[0]] = splitElement[1];
      });
    });

    return parsedData;
  }

  private static validPassport(fields : PassportFields) {
    return Solution.almostValidPassport(fields) && !!fields.cid;
  }

  private static almostValidPassport(fields : PassportFields) {
    return !!fields.byr && !!fields.iyr && !!fields.eyr && !!fields.hgt && !!fields.hcl && !!fields.ecl && !!fields.pid;
  }

  constructor() {
    super();
    const reader = new FileReader();
    this.lines = reader.readFile(inputPath);
  }

  dayNumber(): number {
    return 3;
  }

  partOne(): void {
    const passportData = this.splitIntoGroups().map(this.parsePassportData);
    const validPassports = passportData.filter(Solution.validPassport);
    const almostValidPassports = passportData.filter(Solution.almostValidPassport);

    console.log(`Of the ${passportData.length} passports evaluated, ${validPassports.length} are valid and ${almostValidPassports.length} are almost valid`);
  }

  partTwo(): void {
  }
}