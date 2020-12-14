import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

export class Solution extends FileInputChallenge {
  private static processInstruction(memory: number[], currentMask: string, line: string) {
    const match = line.match(/mem\[(.*)\] = (.*)/);
    const parsedAddress = parseInt(match[1]);
    const parsedValue = parseInt(match[2]);

    const binaryValue = parsedValue.toString(2).padStart(currentMask.length, '0');

    const maskedBinaryValue = binaryValue
      .split('')
      .map((value, index) => currentMask[index] !== 'X' ? currentMask[index] : value)
      .join('');
    const maskedValue = parseInt(maskedBinaryValue, 2);

    memory[parsedAddress] = maskedValue;
  }

  private static processInstructions(instructions: string[]) {
    const memory = [];

    let currentMask: string;
    instructions.forEach(instruction => {
      
      const maskMatch = instruction.match(/mask = (.*)/);
      if (maskMatch) {
        currentMask = maskMatch[1];
      } else {
        Solution.processInstruction(memory, currentMask, instruction);
      }
    });

    return memory;
  }

  private static sumOfMemory(memory: number[]) {
    return memory.reduce((acc, value) => value + acc, 0);
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 14;
  }

  partOne(): void {
    const memory = Solution.processInstructions(this.lines);
    const sum = Solution.sumOfMemory(memory);

    console.log(`The sum of the memory is ${sum}`);
  }
  
  partTwo(): void {
  }
}