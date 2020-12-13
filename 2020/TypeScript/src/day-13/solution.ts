import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface ScheduleDefinition {
  earliestTime: number;
  buses: number[];
}

class ScheduleParser {
  static parseEarliestTimeSchedule(input: string[]): ScheduleDefinition {
    return {
      earliestTime: parseInt(input[0]),
      buses: input[1].split(',').map(s => parseInt(s)).filter(n => !!n)
    };
  }

  static parseTimestampSchedule(input: string[]) {
    return input[1].split(',').map(s => s === 'x' ? undefined : parseInt(s));
  }
}

export class Solution extends FileInputChallenge {
  private static tripsUntilAfterTime(earliestTime: number, bus: number) {
    return Math.ceil(earliestTime / bus);
  }

  private static closestTimeAfter(earliestTime: number, bus: number) {
    return Solution.tripsUntilAfterTime(earliestTime, bus) * bus;
  }

  private static mapBusesToTimes(earliestTime: number, buses: number[]) {
    return buses.map(bus => {
      const time = Solution.closestTimeAfter(earliestTime, bus);
      return {
        bus: bus,
        arrivalTime: time,
        waitTime: time - earliestTime,
      };
    }).sort((a, b) => a.waitTime - b.waitTime);
  }

  private testTime(timestamp: number, options: number[]) {
    for (let index = 0; index < options.length; index += 1) {
      if (options[index]) {
        const necessaryTime = timestamp + index;
        if (necessaryTime % options[index] !== 0) {
          return false;
        }
      }
    }
    return true;
  }

  private lookForMatchingTime(options: number[], startingPoint = 0, bailoutPoint?: number): number {
    let currentTimestamp = startingPoint;
    const firstNumber = options[0];
    while ((bailoutPoint && currentTimestamp <= bailoutPoint) || (!bailoutPoint)) {
      if (this.testTime(currentTimestamp, options)) {
        return currentTimestamp;
      }
      currentTimestamp += firstNumber;
    }

    return undefined;
  }

  private partTwoExample(input: string, expectedAnswer: number): void {
    const options = ScheduleParser.parseTimestampSchedule([undefined, input]);
    const earliestTime = this.lookForMatchingTime(options, 0, expectedAnswer);

    console.log(`Example for '${input}', timestamp ${earliestTime}`);
  }

  private partTwoExamples(): void {
    this.partTwoExample('17,x,13,19', 3417);
    this.partTwoExample('67,7,59,61', 754018);
    this.partTwoExample('67,x,7,59,61', 779210);
    this.partTwoExample('67,7,x,59,61', 1261476);
    this.partTwoExample('1789,37,47,1889', 1202161486);
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 13;
  }

  partOne(): void {
    const scheduleDefinition = ScheduleParser.parseEarliestTimeSchedule(this.lines);
    const earliestTimes = Solution.mapBusesToTimes(scheduleDefinition.earliestTime, scheduleDefinition.buses);
    const earliestBus = earliestTimes[0];

    console.log(`The earliest bus is ${earliestBus.bus} arriving at ${earliestBus.arrivalTime} with a wait time of ${earliestBus.waitTime}`);
    console.log(`The solution is ${earliestBus.bus * earliestBus.waitTime}`);
  }

  partTwo(): void {
    this.partTwoExamples();
  
    const options = ScheduleParser.parseTimestampSchedule(this.lines);
    const earliestTime = this.lookForMatchingTime(options, 100000000000000);

    console.log(`The earliest schedule matching the rules is ${earliestTime}`);
  }
}
