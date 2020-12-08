import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

enum InstructionType {
  acc = 'acc',
  jmp = 'jmp',
  nop = 'nop',
}

interface Instruction {
  type: InstructionType;
  number: number;
}

class CodeParser {
  static parse(input: string[]) : Instruction[] {
    const lineRegex = /^(\w{3}) ([+-]\d+)$/; 
    return input.map(line => {
      const match = line.match(lineRegex);
      return {
        type: match[1] as InstructionType,
        number: parseInt(match[2])
      } as Instruction;
    });
  }
}

class BootCodeState {
  private instructions: Instruction[];
  private accumlator: number;
  private nextInstructionIndex: number;
  private visitedInstructions: number[];

  private runOne(instructionIndex: number) {
    const instruction = this.instructions[instructionIndex];

    // console.log(`Running: ${instruction.type} ${instruction.number}`);
    // console.log(`  Before accumulator: ${this.accumlator}`);

    this.visitedInstructions.push(instructionIndex);

    switch (instruction.type) {
      case InstructionType.nop:
        this.nextInstructionIndex += 1;
        break;
      case InstructionType.acc:
        this.accumlator += instruction.number;
        this.nextInstructionIndex += 1;
        break;
      case InstructionType.jmp:
        this.nextInstructionIndex += instruction.number;
        break;
    }

    // console.log(`  After accumulator: ${this.accumlator}`);
    // console.log(`  Next instruction: ${this.nextInstructionIndex}`);
  }

  private alreadyRunNextInstruction() {
    return this.visitedInstructions.includes(this.nextInstructionIndex);
  }

  constructor(instructions: Instruction[]) {
    this.instructions = instructions;
    this.visitedInstructions = [];
    this.accumlator = 0;
    this.nextInstructionIndex = 0;
  }

  runUntilAboutToRepeat() {
    while (!this.alreadyRunNextInstruction()) {
      this.runOne(this.nextInstructionIndex);
    }
  }

  accumulatorValue() {
    return this.accumlator;
  }
}

export class Solution extends FileInputChallenge {
  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 8;
  }

  partOne(): void {
    const parsedInstructions = CodeParser.parse(this.lines);
    const state = new BootCodeState(parsedInstructions);
    state.runUntilAboutToRepeat();
    console.log(`The accumulator is at ${state.accumulatorValue()} before the code starts to repeat`);
  }

  partTwo(): void {
  }
}
