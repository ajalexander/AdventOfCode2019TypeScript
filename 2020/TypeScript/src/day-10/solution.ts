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

  private addStepToCopyOfChain(chain: ChainingStep[], step: ChainingStep) {
    const copy = chain.slice(0);
    copy.push(step);
    return copy;
  }

  private buildChainsFromPoint(currentSteps: ChainingStep[] = [], startIndex = 0): ChainingStep[][] {
    const possibleChains: ChainingStep[][] = [];

    const previous = currentSteps.length > 0 ?  currentSteps[currentSteps.length - 1].adapterSize : 0;
    for (let index = startIndex; index < this.sortedAdapters.length; index += 1) {
      const adapter = this.sortedAdapters[index];
      const stepChange = adapter - previous;

      if (stepChange <= 3) {
        const newChain = this.addStepToCopyOfChain(currentSteps, {
          adapterSize: adapter,
          stepChange: stepChange,
          deviceStep: false,
        });
        possibleChains.push(...this.buildChainsFromPoint(newChain, index + 1));
      }
    }

    const newChain = this.addStepToCopyOfChain(currentSteps, {
      adapterSize: previous + 3,
      stepChange: 3,
      deviceStep: true,
    });
    possibleChains.push(newChain);

    return possibleChains.sort((a, b) => this.maximumJoltage(a) - this.maximumJoltage(b));
  }
  
  private buildAllPossibleChainsToTotal(targetTotal: number): ChainingStep[][] {
    const possibleChains = this.buildChainsFromPoint();
    const validChains = possibleChains.filter(chain => this.maximumJoltage(chain) === targetTotal);
    return validChains;
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

  private maximumJoltage(steps: ChainingStep[]) {
    return steps[steps.length - 1].adapterSize;
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
    const largestChain = this.buildLargestChain();
    const validChains = this.buildAllPossibleChainsToTotal(this.maximumJoltage(largestChain));
    console.log(`There are ${validChains.length} possible chains`);
  }
}
