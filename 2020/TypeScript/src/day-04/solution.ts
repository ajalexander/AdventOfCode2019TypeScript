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
  private groups: string[][];

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

  private static validationRules = {
    byr: Solution.validByr,
    iyr: Solution.validIyr,
    eyr: Solution.validEyr,
    hgt: Solution.validHgt,
    hcl: Solution.validHcl,
    ecl: Solution.validEcl,
    pid: Solution.validPid,
  };

  private static hasRequiredFields(fields : PassportFields) {
    return Object.keys(Solution.validationRules).every(key => !!fields[key]);
  }

  private static validPassport(fields : PassportFields) {
    return Solution.hasRequiredFields(fields)
      && Object.keys(Solution.validationRules).every(key => Solution.validationRules[key](fields[key]));
  }

  constructor() {
    super();
    const reader = new FileReader();
    this.groups = reader.readFileIntoLineGroups(inputPath);
  }

  dayNumber(): number {
    return 4;
  }

  partOne(): void {
    const passportData = this.groups.map(this.parsePassportData);
    const validPassports = passportData.filter(Solution.hasRequiredFields);

    console.log(`Of the ${passportData.length} passports evaluated, ${validPassports.length} have the required fields`);
  }

  partTwo(): void {
    const passportData = this.groups.map(this.parsePassportData);
    const validPassports = passportData.filter(Solution.validPassport);

    console.log(`Of the ${passportData.length} passports evaluated, ${validPassports.length} are valid`);
  }
}