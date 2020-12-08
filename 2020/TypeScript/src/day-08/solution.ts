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

class MachineState {
  readonly instructions: Instruction[];
  readonly accumulator: number;
  readonly nextInstructionIndex: number;

  constructor(instructions: Instruction[], accumulator = 0, nextInstructionIndex = 0) {
    this.instructions = instructions;
    this.accumulator = accumulator;
    this.nextInstructionIndex = nextInstructionIndex;
  }

  step() {
    const instruction = this.instructions[this.nextInstructionIndex];

    // console.log(`Running: ${instruction.type} ${instruction.number}`);
    // console.log(`  Before accumulator: ${this.accumulator}`);

    switch (instruction.type) {
      case InstructionType.nop:
        return new MachineState(this.instructions, this.accumulator, this.nextInstructionIndex + 1);
      case InstructionType.acc:
        return new MachineState(this.instructions, this.accumulator + instruction.number, this.nextInstructionIndex + 1);
      case InstructionType.jmp:
        return new MachineState(this.instructions, this.accumulator, this.nextInstructionIndex + instruction.number);
    }
  }

  endOfInstructions() {
    return this.instructions.length <= this.nextInstructionIndex;
  }
}

interface ExecutionResult {
  finalState: MachineState;
  terminationReason: TerminationReason;
}

class CodeRunner {
  private visitedInstructions: number[];
  private currentState: MachineState;

  private runOneStep() {
    this.visitedInstructions.push(this.currentState.nextInstructionIndex);
    this.currentState = this.currentState.step();
  }

  private alreadyRunNextInstruction() {
    return this.visitedInstructions.includes(this.currentState.nextInstructionIndex);
  }

  private atEndOfProgram() {
    return this.currentState.endOfInstructions();
  }

  constructor(instructions: Instruction[]) {
    this.currentState = new MachineState(instructions);
    this.visitedInstructions = [];
  }

  run(): ExecutionResult {
    while (!this.atEndOfProgram()) {
      if (this.alreadyRunNextInstruction()) {
        return {
          finalState: this.currentState,
          terminationReason: TerminationReason.infiniteLoop,
        };
      }
      this.runOneStep();
    }

    return {
      finalState: this.currentState,
      terminationReason: TerminationReason.endOfInstructions,
    };
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

    const codeRunner = new CodeRunner(workingInstructionSet);
    const result = codeRunner.run();

    return result;
  }

  constructor(private codeLines: string[]){
  }

  cleanCode() {
    let nextIndexToTry = 0;
    while (nextIndexToTry < this.codeLines.length) {
      const attemptedRunResult = this.attemptCorrection(nextIndexToTry);

      if (attemptedRunResult.terminationReason === TerminationReason.endOfInstructions) {
        return attemptedRunResult.finalState;
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
    const codeRunner = new CodeRunner(parsedInstructions);
    const runResult = codeRunner.run();
    console.log(`The accumulator is at ${runResult.finalState.accumulator} before the code starts to repeat`);
  }

  partTwo(): void {
    const cleaner = new CodeCorruptionCleaner(this.lines);
    const finalState = cleaner.cleanCode();
    console.log(`The accumulator is at ${finalState.accumulator} after the cleaned code completes`);

  }
}
