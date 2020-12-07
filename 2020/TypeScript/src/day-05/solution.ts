import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface ParsedTicket {
  specification: string;
  row: number;
  column: number;
  seatId: number;
}

export class Solution extends FileInputChallenge {
  private static parseForNumber(valueSpecification: string, rangeSize: number, lowSymbol: string, highSymbol: string) {
    const possibleRange = {
      minimum: 0,
      maximum: rangeSize - 1
    };
    [...valueSpecification].forEach(value => {
      switch(value) {
        case lowSymbol:
          possibleRange.maximum = possibleRange.maximum - (possibleRange.maximum + 1 - possibleRange.minimum) / 2;
          break;
        case highSymbol:
          possibleRange.minimum = possibleRange.minimum + (possibleRange.maximum + 1 - possibleRange.minimum) / 2;
          break;
      }
    });
    return possibleRange.minimum;
  }

  private static findRowNumber(rowPortion: string) {
    return Solution.parseForNumber(rowPortion, 128, 'F', 'B');
  }

  private static findColumnNumber(columnPortion: string) {
    return Solution.parseForNumber(columnPortion, 8, 'L', 'R');
  }
  
  private static parseTicket(specification: string) {
    const rowPortion = specification.substr(0, 7);
    const columnPortion = specification.substr(7, 3);

    const rowNumber = Solution.findRowNumber(rowPortion);
    const columnNumber = Solution.findColumnNumber(columnPortion);
    const seatId = rowNumber * 8 + columnNumber;

    return {
      specification: specification,
      row: rowNumber,
      column: columnNumber,
      seatId: seatId
    } as ParsedTicket;
  }

  private static sortTicket(left: ParsedTicket, right: ParsedTicket) {
    if (left.seatId < right.seatId) {
      return -1;
    }
    if (left.seatId > right.seatId) {
      return 1;
    }
    return 0;
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 5;
  }

  partOne(): void {
    const parsedTickets = this.lines.map(Solution.parseTicket);
    const largestSeatIdTicket = parsedTickets.reduce((a, b) => a.seatId > b.seatId ? a : b);

    console.log(`The ticket with the largest seat ID is ${largestSeatIdTicket.seatId}`);
  }

  partTwo(): void {
    const parsedTickets = this.lines.map(Solution.parseTicket);
    const seatIds = parsedTickets.map(ticket => ticket.seatId).sort();
    const smallestSeatId = parsedTickets.reduce((a, b) => a.seatId < b.seatId ? a : b).seatId;
    const largestSeatId = parsedTickets.reduce((a, b) => a.seatId > b.seatId ? a : b).seatId;

    const possibleSeats = Array.from({ length: largestSeatId - smallestSeatId }, (_, k) => k + smallestSeatId);
    const missingSeat = possibleSeats.filter(seatId => !seatIds.includes(seatId))[0];

    console.log(`The missing seat ID is ${missingSeat}`);
  }
}