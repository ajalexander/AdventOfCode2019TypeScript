import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
// const preambleSize = 5;

const inputFile = 'problemInput.txt';
const preambleSize = 25;

const inputPath = `${__dirname}/${inputFile}`;

export class Solution extends FileInputChallenge {
  private readonly numbers: number[];

  private possibleBySummation(target: number, possibleInputs: number[]) {
    // console.log(`Checking for the validity of ${target} given inputs of ${possibleInputs}`);

    for (let index1 = 0; index1 < possibleInputs.length; index1 += 1) {
      for (let index2 = 0; index2 < possibleInputs.length; index2 += 1) {
        if (index1 === index2) {
          continue;
        }

        if (target === (possibleInputs[index1] + possibleInputs[index2])) {
          return true;
        }
      }
    }

    return false;
  }

  private findInadherentNumbers(numbers: number[], preambleSize: number) {
    const inadherentNumbers = [];
    for (let index = preambleSize; index < numbers.length; index += 1) {
      if (!this.possibleBySummation(numbers[index], numbers.slice(index - preambleSize, index))) {
        inadherentNumbers.push(numbers[index]);
      }
    }
    return inadherentNumbers;
  }

  constructor() {
    super(inputPath);
    this.numbers = this.lines.map(s => parseInt(s));
  }

  dayNumber(): number {
    return 9;
  }

  partOne(): void {
    const inadherentNumbers = this.findInadherentNumbers(this.numbers, preambleSize);
    console.log(`The inadherent numbers are: ${inadherentNumbers}`);
  }

  partTwo(): void {
  }
}
