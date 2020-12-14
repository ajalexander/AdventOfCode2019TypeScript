import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example1.txt';
// const inputFile = 'example2.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface Memory {
  [key: number] : number;
}

export class Solution extends FileInputChallenge {
  private static processInstructionVersion1(memory: Memory, currentMask: string, line: string) {
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

  private static processInstructionVersion2(memory: Memory, currentMask: string, line: string) {
    const match = line.match(/mem\[(.*)\] = (.*)/);
    const parsedAddress = parseInt(match[1]);
    const parsedValue = parseInt(match[2]);

    const binaryAddress = parsedAddress.toString(2).padStart(currentMask.length, '0');

    const maskedBinaryAddress = binaryAddress
      .split('')
      .map((value, index) => {
        switch (currentMask[index]) {
          case '0':
            return value;
          case '1':
            return 1;
          default:
            return 'X';
        }
      })
      .join('');
    

    const possibleValues = ['0', '1'];

    const splitAddress = maskedBinaryAddress.split('');
    let addresses = [splitAddress];

    while (addresses[0].includes('X')) {
      const currentIndex = addresses[0].indexOf('X');

      const newAddresses = [];
      addresses.forEach(address => {
        possibleValues.forEach(newValue => {
          const newAddress = address.slice(0);
          newAddress[currentIndex] = newValue;
          newAddresses.push(newAddress);
        });
      });

      addresses = newAddresses;
    }

    addresses.forEach(address => {
      memory[parseInt(address.join(''), 2)] = parsedValue;
    });
  }

  private static processInstructions(instructions: string[], processFunction: (memory: Memory, currentMask: string, line: string) => void) {
    const memory: Memory = {};

    let currentMask: string;
    instructions.forEach((instruction) => {
      
      const maskMatch = instruction.match(/mask = (.*)/);
      if (maskMatch) {
        currentMask = maskMatch[1];
      } else {
        processFunction(memory, currentMask, instruction);
      }
    });

    return memory;
  }

  private static sumOfMemory(memory: Memory) {
    return Object.values(memory).reduce((acc, value) => value + acc, 0);
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 14;
  }

  partOne(): void {
    const memory = Solution.processInstructions(this.lines, Solution.processInstructionVersion1);
    const sum = Solution.sumOfMemory(memory);

    console.log(`The sum of the memory is ${sum}`);
  }
  
  partTwo(): void {
    const memory = Solution.processInstructions(this.lines, Solution.processInstructionVersion2);
    const sum = Solution.sumOfMemory(memory);

    console.log(`The sum of the memory is ${sum}`);
  }
}