import { DayChallenge } from '../common/dayChallenge';
import { FileReader } from '../common/fileUtils';

// const inputPath = './src/day-04/examplePartOne.txt';
// const inputPath = './src/day-04/examplePartTwo.txt';
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

  private static hasRequiredFields(fields : PassportFields) {
    return !!fields.byr && !!fields.iyr && !!fields.eyr && !!fields.hgt && !!fields.hcl && !!fields.ecl && !!fields.pid;
  }

  private static validByr(input: string) {
    if (!input.match(/^\d{4}$/)) {
      return false;
    }

    const parsedNumber = parseInt(input);
    return parsedNumber >= 1920 && parsedNumber <= 2002;
  }

  private static validIyr(input: string) {
    if (!input.match(/^\d{4}$/)) {
      return false;
    }

    const parsedNumber = parseInt(input);
    return parsedNumber >= 2010 && parsedNumber <= 2020;
  }

  private static validEyr(input: string) {
    if (!input.match(/^\d{4}$/)) {
      return false;
    }

    const parsedNumber = parseInt(input);
    return parsedNumber >= 2020 && parsedNumber <= 2030;
  }

  private static validHgt(input: string) {
    const match = input.match(/^(\d+)(cm|in)$/);
    if (!match) {
      return false;
    }

    const parsedNumber = parseInt(match[1]);
    const unit = match[2];
    if (unit === 'cm') {
      return parsedNumber >= 150 && parsedNumber <= 193;
    }
    return parsedNumber >= 59 && parsedNumber <= 76;
  }

  private static validHcl(input: string) {
    return !!input.match(/^#[0-9a-f]{6}$/);
  }

  private static validEcl(input: string) {
    return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(input);
  }

  private static validPid(input: string) {
    return !!input.match(/^\d{9}$/)
  }

  private static validPassport(fields : PassportFields) {
    if (!Solution.hasRequiredFields(fields)) {
      return false;
    }
    return Solution.hasRequiredFields(fields)
      && Solution.validByr(fields.byr)
      && Solution.validIyr(fields.iyr)
      && Solution.validEyr(fields.eyr)
      && Solution.validHgt(fields.hgt)
      && Solution.validHcl(fields.hcl)
      && Solution.validEcl(fields.ecl)
      && Solution.validPid(fields.pid);
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
    const validPassports = passportData.filter(Solution.hasRequiredFields);

    console.log(`Of the ${passportData.length} passports evaluated, ${validPassports.length} have the required fields`);
  }

  partTwo(): void {
    const passportData = this.splitIntoGroups().map(this.parsePassportData);
    const validPassports = passportData.filter(Solution.validPassport);

    console.log(`Of the ${passportData.length} passports evaluated, ${validPassports.length} are valid`);
  }
}