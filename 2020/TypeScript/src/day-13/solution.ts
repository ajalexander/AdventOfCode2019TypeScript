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

  private lookForMatchingTime(options: number[]): number {
    const inputs = options
      .map((value, index) => {
        return {
          offset: index,
          bus: value
        };
      })
      .filter(item => item.bus);
    
    let period = inputs[0].bus;
    let time = period;

    inputs.slice(1).forEach(item => {
      while ((time + item.offset) % item.bus !== 0) {
        time += period;
      }

      period *= item.bus;
    });

    return time;
  }

  // private partTwoExample(input: string): void {
  //   const options = ScheduleParser.parseTimestampSchedule([undefined, input]);
  //   const earliestTime = this.lookForMatchingTime(options);

  //   console.log(`Example for '${input}', timestamp ${earliestTime}`);
  // }

  // private partTwoExamples(): void {
  //   this.partTwoExample('17,x,13,19');
  //   this.partTwoExample('67,7,59,61');
  //   this.partTwoExample('67,x,7,59,61');
  //   this.partTwoExample('67,7,x,59,61');
  //   this.partTwoExample('1789,37,47,1889');
  // }

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
    // this.partTwoExamples();
  
    const options = ScheduleParser.parseTimestampSchedule(this.lines);
    const earliestTime = this.lookForMatchingTime(options);

    console.log(`The earliest schedule matching the rules is ${earliestTime}`);
  }
}
