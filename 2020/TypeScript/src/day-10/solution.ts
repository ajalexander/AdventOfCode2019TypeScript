import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example1.txt';
// const inputFile = 'example2.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface ChainingStep {
  adapterSize: number;
  stepChange: number;
}

export class Solution extends FileInputChallenge {
  private sortedAdapters: number[];

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
        })
        previous = adapter;
      } else {
        break;
      }
    }

    steps.push({
      adapterSize: previous + 3,
      stepChange: 3,
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
  }
}
