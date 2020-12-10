import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example1.txt';
// const inputFile = 'example2.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface ChainingStep {
  adapterSize: number;
  stepChange: number;
  deviceStep: boolean;
}

export class Solution extends FileInputChallenge {
  private sortedAdapters: number[];

  private countPathsFromStartToEnd() {
    const waysToReachPointMap = {};
    for (let index = 0; index < this.sortedAdapters.length; index += 1) {
      if (this.sortedAdapters[index] <= 3) {
        waysToReachPointMap[index] = 1;
      } else {
        waysToReachPointMap[index] = 0;
      }
      
      for (let lowerIndex = index - 3; lowerIndex < index; lowerIndex += 1) {
        if (lowerIndex < 0) {
          continue;
        }

        if (this.sortedAdapters[index] - this.sortedAdapters[lowerIndex] <= 3) {
          waysToReachPointMap[index] = waysToReachPointMap[index] + waysToReachPointMap[lowerIndex];
        }
      }

      // console.log(`There are ${waysToReachPointMap[index]} ways to reach ${this.sortedAdapters[index]}`);
    }

    return waysToReachPointMap[this.sortedAdapters.length - 1];
  }

  private buildLargestChain(): ChainingStep[] {
    const steps: ChainingStep[] = [];

    let previous = 0;
    for (let index = 0; index < this.sortedAdapters.length; index += 1) {
      const adapter = this.sortedAdapters[index];
      const stepChange = adapter - previous;

      if (stepChange <= 3) {
        steps.push({
          adapterSize: adapter,
          stepChange: stepChange,
          deviceStep: false,
        })
        previous = adapter;
      } else {
        break;
      }
    }

    steps.push({
      adapterSize: previous + 3,
      stepChange: 3,
      deviceStep: true,
    });

    return steps;
  }

  private countJumpsByStepSize(steps: ChainingStep[]) {
    return steps.reduce((jumpsByStep, step) => {
      jumpsByStep[step.stepChange] = (jumpsByStep[step.stepChange] || 0) + 1;
      return jumpsByStep;
    }, {});
  }

  constructor() {
    super(inputPath);
    this.sortedAdapters = this.lines
      .map(s => parseInt(s))
      .sort((a, b) => a - b);
  }

  dayNumber(): number {
    return 10;
  }

  partOne(): void {
    const largestChain = this.buildLargestChain();
    const jumpsBySize = this.countJumpsByStepSize(largestChain);
    const oneJoltJumps = jumpsBySize[1];
    const threeJoltJumps = jumpsBySize[3];
    const solution = oneJoltJumps * threeJoltJumps;
    console.log(`The production of the one jolt jumps (${oneJoltJumps}) and three jolt jumps (${threeJoltJumps}) is ${solution}`);
  }

  partTwo(): void {
    const possiblePaths = this.countPathsFromStartToEnd();
    console.log(`There are ${possiblePaths} possible chains`);
  }
}
