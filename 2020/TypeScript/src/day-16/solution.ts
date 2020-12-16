import { GroupedFileInputChallenge } from "../common/dayChallenge";

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface Range {
  minimum: number;
  maximum: number;
}

interface FieldRanges {
  field: string;
  validRanges: Range[];
}

interface ParsedData {
  fields: FieldRanges[];

  yourValues: number[];

  nearbyValues: number[][];
}

class InputParser {
  private static parseRange(range: string): Range {
    const parts = range.split('-');
    return {
      minimum: parseInt(parts[0]),
      maximum: parseInt(parts[1]),
    };
  }

  private static parseFieldRule(line: string): FieldRanges {
    const parts = line.match(/^(.*): (.*)$/);
    const field = parts[1];
    const ranges = parts[2].split(' or ');

    return {
      field: field,
      validRanges: ranges.map(InputParser.parseRange),
    };
  }

  private static parseFieldRules(lines: string[]) {
    return lines.map(InputParser.parseFieldRule);
  }

  private static parseNumbers(line: string) {
    return line.split(',').map(s => parseInt(s));
  }

  private static parseYourTicket(lines: string[]) {
    return InputParser.parseNumbers(lines[1]);
  }

  private static parseNearbyTickets(lines: string[]) {
    return lines.filter((_, index) => index > 0).map(InputParser.parseNumbers);
  }

  static parse(groupedLines: string[][]): ParsedData {
    return {
      fields: InputParser.parseFieldRules(groupedLines[0]),
      yourValues: InputParser.parseYourTicket(groupedLines[1]),
      nearbyValues: InputParser.parseNearbyTickets(groupedLines[2]),
    } as ParsedData;
  }
}

export class Solution extends GroupedFileInputChallenge {
  private static checkForValidity(fields: FieldRanges[], value: number): boolean {
    return fields.some(field => {
      return field.validRanges.some(range => {
        return range.minimum <= value && range.maximum >= value;
      });
    });
  }

  private static findInvalidTicketValues(input: ParsedData): number[] {
    const invalidValues = [];

    input.nearbyValues.forEach(nearby => {
      nearby.forEach(number => {
        if (!this.checkForValidity(input.fields, number)) {
          invalidValues.push(number);
        }
      });
    });

    return invalidValues;
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 16;
  }

  partOne(): void {
    const input = InputParser.parse(this.groups);
    const invalidValues = Solution.findInvalidTicketValues(input);

    const errorRate = invalidValues.reduce((acc, value) => acc + value, 0);
    console.log(`The ticket error rate is ${errorRate}`);
  }

  partTwo(): void {

  }
}
