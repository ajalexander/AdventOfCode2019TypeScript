import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface ScheduleDefinition {
  earliestTime: number;
  buses: number[];
}

class ScheduleParser {
  static parse(input: string[]): ScheduleDefinition {
    return {
      earliestTime: parseInt(input[0]),
      buses: input[1].split(',').map(s => parseInt(s)).filter(n => !!n)
    };
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

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 13;
  }

  partOne(): void {
    const scheduleDefinition = ScheduleParser.parse(this.lines);
    const earliestTimes = Solution.mapBusesToTimes(scheduleDefinition.earliestTime, scheduleDefinition.buses);
    const earliestBus = earliestTimes[0];

    console.log(`The earliest bus is ${earliestBus.bus} arriving at ${earliestBus.arrivalTime} with a wait time of ${earliestBus.waitTime}`);
    console.log(`The solution is ${earliestBus.bus * earliestBus.waitTime}`);
  }

  partTwo(): void {
  }
}
