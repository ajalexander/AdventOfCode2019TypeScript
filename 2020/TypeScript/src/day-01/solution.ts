import { FileInputChallenge } from '../common/dayChallenge';
import { SetBuilder } from './setBuilder';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

const targetSum = 2020;

export class Solution extends FileInputChallenge {
  private numbers: number[];

  private solve(numberOfInputs: number) {
    const sets = new SetBuilder().buildPossibleSets(this.numbers, numberOfInputs);
  
    sets.forEach(set => {
      let sum = 0;
      let product = 1;
  
      set.forEach(item => {
        sum += item;
        product *= item;
      });
  
      if (sum === targetSum) {
        console.log(`The product of [${set}] is ${product}`);
      }
    });
  }

  constructor() {
    super(inputPath);
    this.numbers = this.lines.map(s => parseInt(s));
  }

  dayNumber(): number {
    return 1;
  }

  partOne(): void {
    this.solve(2);
  }

  partTwo(): void {
    this.solve(3);
  }
}
