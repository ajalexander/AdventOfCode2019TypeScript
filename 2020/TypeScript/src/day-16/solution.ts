import { GroupedFileInputChallenge } from "../common/dayChallenge";

// const inputFile = 'example1.txt';
// const inputFile = 'example2.txt';
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

interface PossibleMatches {
  [field: string]: number[];
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
  private static checkForFieldMatch(field: FieldRanges, value: number): boolean {
    return field.validRanges.some(range => {
      return range.minimum <= value && range.maximum >= value;
    });
  }

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

  private static filterToValidTickets(input: ParsedData): number[][] {
    const validTicketValues = [input.yourValues];

    input.nearbyValues.forEach(nearby => {
      if (nearby.every(number => this.checkForValidity(input.fields, number))) {
        validTicketValues.push(nearby);
      }
    });

    return validTicketValues;
  }

  private static valuesMatchField(field: FieldRanges, values: number[]) {
    return values.every(value => Solution.checkForFieldMatch(field, value));
  }

  private static findPossiblePositionsForFields(fields: FieldRanges[], tickets: number[][]): PossibleMatches {
    const positionsMetByRule: PossibleMatches = {};

    for (let valueIndex = 0; valueIndex < tickets[0].length; valueIndex += 1) {
      const values = tickets.map(ticket => ticket[valueIndex]);

      fields.forEach(field => {
        if (Solution.valuesMatchField(field, values)) {
          if (!positionsMetByRule[field.field]) {
            positionsMetByRule[field.field] = [];
          }
          positionsMetByRule[field.field].push(valueIndex);
        }
      });
    }

    return positionsMetByRule;
  }

  private static mapFieldsToPositions(fields: FieldRanges[], tickets: number[][]) {
    const possiblePositionsForFields = Solution.findPossiblePositionsForFields(fields, tickets);

    const mapping = {};
    const foundFields = [];
    const remainingFields = fields.map(field => field.field);

    while (remainingFields.length > 0) {
      remainingFields.forEach((field, index) => {
        if (possiblePositionsForFields[field].length === 1) {
          foundFields.push(field);
          remainingFields.splice(index, 1);
          mapping[field] = possiblePositionsForFields[field][0];

          remainingFields.forEach(other => {
            const index = possiblePositionsForFields[other].indexOf(mapping[field]);
            if (index >= 0) {
              possiblePositionsForFields[other].splice(index, 1);
            }
          });
        }
      });
    }

    return mapping;
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
    const input = InputParser.parse(this.groups);
    const validTickets = Solution.filterToValidTickets(input);
    const fieldMapping = Solution.mapFieldsToPositions(input.fields, validTickets);

    const departureFields = input.fields.filter(field => field.field.startsWith('departure'));
    const values = departureFields.map(field => input.yourValues[fieldMapping[field.field]]);

    const multipliedValue = values.reduce((acc, value) => acc * value, 1);

    console.log(`The product of the departure values is ${multipliedValue}`);
  }
}
