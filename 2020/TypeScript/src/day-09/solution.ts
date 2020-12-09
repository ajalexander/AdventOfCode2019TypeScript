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
    for (let index = preambleSize; index < numbers.length; index += 1) {
      if (!this.possibleBySummation(numbers[index], numbers.slice(index - preambleSize, index))) {
        return numbers[index];
      }
    }
    return null;
  }

  private findContigousRangeEqualingNumber(numbers: number[], targetNumber: number) {
    const targetIndex = numbers.indexOf(targetNumber);

    for (let startIndex = 0; startIndex < targetIndex; startIndex += 1) {
      for (let endIndex = startIndex + 1; endIndex < targetIndex; endIndex += 1) {
        const contigousRange = numbers.slice(startIndex, endIndex + 1);
        const contiguousSum = numbers.slice(startIndex, endIndex + 1).reduce((acc, value) => acc + value, 0);
        if (contiguousSum === targetNumber) {
          const smallestValue = Math.min(...contigousRange);
          const largetValue = Math.max(...contigousRange);

          // console.log(`The contigous range from ${startIndex} - ${endIndex} produces the sum of ${targetNumber}`);
          // console.log(`The smallest value in that range is ${smallestValue}; the largest is ${largetValue}`);

          return {
            smallest: smallestValue,
            largest: largetValue,
          };
        }
      }
    }
    return null;
  }

  constructor() {
    super(inputPath);
    this.numbers = this.lines.map(s => parseInt(s));
  }

  dayNumber(): number {
    return 9;
  }

  partOne(): void {
    const inadherentNumber = this.findInadherentNumbers(this.numbers, preambleSize);
    console.log(`The first inadherent number is: ${inadherentNumber}`);
  }

  partTwo(): void {
    const inadherentNumber = this.findInadherentNumbers(this.numbers, preambleSize);
    const range = this.findContigousRangeEqualingNumber(this.numbers, inadherentNumber);
    const sum = range.smallest + range.largest;
    console.log(`The sum of the contiguous range is ${sum}`);
  }
}
