import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

enum TerminationReason {
  endOfInstructions,
  infiniteLoop
}

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
  instructions: Instruction[];
  accumulator: number;
  nextInstructionIndex: number;
  visitedInstructions: number[];
  terminationReason?: TerminationReason;

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
        this.accumulator += instruction.number;
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
    this.accumulator = 0;
    this.nextInstructionIndex = 0;
  }

  run() {
    while (this.nextInstructionIndex < this.instructions.length) {
      if (this.alreadyRunNextInstruction()) {
        this.terminationReason = TerminationReason.infiniteLoop;
        return;
      }
      this.runOne(this.nextInstructionIndex);
    }
    this.terminationReason = TerminationReason.endOfInstructions;
  }
}

class CodeCorruptionCleaner {
  private attemptCorrection(nextIndexToTry: number) {
    const workingInstructionSet = CodeParser.parse(this.codeLines);
      const instruction = workingInstructionSet[nextIndexToTry];
      switch (instruction.type) {
        case InstructionType.nop:
          instruction.type = InstructionType.jmp;
          break;
        case InstructionType.jmp:
          instruction.type = InstructionType.nop;
          break;
      }

      const state = new BootCodeState(workingInstructionSet);
      state.run();

      return state;
  }

  constructor(private codeLines: string[]){
  }

  cleanCode() {
    let nextIndexToTry = 0;
    while (nextIndexToTry < this.codeLines.length) {
      const stateFromAttempt = this.attemptCorrection(nextIndexToTry);

      if (stateFromAttempt.terminationReason === TerminationReason.endOfInstructions) {
        return stateFromAttempt;
      }

      nextIndexToTry += 1;
    }

    return null;
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
    state.run();
    console.log(`The accumulator is at ${state.accumulator} before the code starts to repeat`);
  }

  partTwo(): void {
    const cleaner = new CodeCorruptionCleaner(this.lines);
    const state = cleaner.cleanCode();
    console.log(`The accumulator is at ${state.accumulator} after the cleaned code completes`);

  }
}
