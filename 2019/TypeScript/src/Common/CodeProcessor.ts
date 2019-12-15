import { InMemoryBufferIOManager, IOManager } from "./IOManager";

export enum HaltReason {
  outOfCommands,
  terminated,
  outOfInput
}

enum ParameterMode {
  position,
  immediate,
  relative
}

export class ProgramState {
  opcodes: number[];
  index: number;
  relativeBase: number;
  haltReason?: HaltReason;

  constructor(opcodes: number[]) {
    this.opcodes = opcodes;
    this.index = 0;
    this.relativeBase = 0;
  }

  static fromString(codeString: string) : ProgramState {
    return new ProgramState(codeString.split(',').map(s => parseInt(s)));
  }
}

export class CodeProcessor {
  private ioManager : IOManager;

  constructor(ioManager: IOManager = new InMemoryBufferIOManager()) {
    this.ioManager = ioManager;
  }

  private ensureFilledThroughIndex(opcodes: number[], index: number) {
    if (index >= opcodes.length) {
      for (let i = opcodes.length; i <= index; i += 1) {
        opcodes[i] = 0;
      }
    }
  }

  private getValue(opcodes: number[], index: number) {
    if (index > opcodes.length) {
      return 0;
    }
    // this.ensureFilledThroughIndex(opcodes, index);
    return opcodes[index];
  }

  private parameterMode(offset: number, modeCodes: number) {
    while (offset > 0) {
      modeCodes = Math.floor(modeCodes / 10);
      offset -= 1;
    }
    const modeCode = modeCodes % 10;
    switch (modeCode) {
      case 2:
        return ParameterMode.relative;
      case 1:
        return ParameterMode.immediate;
      default:
        return ParameterMode.position;
    }
  }

  private processAddition(opcodes: number[], parameters: number[]) {
    opcodes[parameters[2]] = parameters[0] + parameters[1];
  }

  private processMultiplication(opcodes: number[], parameters: number[]) {
    opcodes[parameters[2]] = parameters[0] * parameters[1];
  }

  private processLessThan(opcodes: number[], parameters: number[]) {
    opcodes[parameters[2]] = parameters[0] < parameters[1] ? 1 : 0;
  }

  private processEquals(opcodes: number[], parameters: number[]) {
    opcodes[parameters[2]] = parameters[0] === parameters[1] ? 1 : 0;
  }

  private processInput(opcodes: number[], parameters: number[]) : boolean {
    const input = this.ioManager.input();
    if (input !== undefined) {
      opcodes[parameters[0]] = input;
      return true;
    }
    return false;
  }

  private processOutput(parameters: number[]) {
    const value = parameters[0];
    this.ioManager.output(value);
  }

  private processJumpIfTrue(parameters: number[]) : number | undefined {
    if (parameters[0] === 0) {
      return undefined;
    }
    return parameters[1];
  }

  private processJumpIfFalse(parameters: number[]) : number | undefined {
    if (parameters[0] !== 0) {
      return undefined;
    }
    return parameters[1];
  }

  private processRelativeBaseAdjustment(state: ProgramState, parameters: number[]) {
    state.relativeBase += parameters[0];
  }

  private getParameters(state: ProgramState, operationIndex: number, parameterCount: number, modeCodes: number, lastValueIsTargetParameter = true) {
    const parameters = [];

    for (let index = 0; index < parameterCount; index += 1) {
      let parameterMode = this.parameterMode(index, modeCodes);
      const isLastParameter = index === (parameterCount - 1)
      const positionIndex = operationIndex + index + 1;
      const positionValue = state.opcodes[positionIndex];

      // A target parameter cannot use immediate mode
      if (lastValueIsTargetParameter && isLastParameter) {
        if (parameterMode === ParameterMode.relative) {
          parameters.push(positionValue + state.relativeBase);
        } else {
          parameters.push(positionValue);
        }
      }
      else {
        switch(parameterMode) {
          case ParameterMode.relative:
            parameters.push(this.getValue(state.opcodes, positionValue + state.relativeBase));
            break;
          case ParameterMode.immediate:
            parameters.push(positionValue);
            break;
          case ParameterMode.position:
            parameters.push(this.getValue(state.opcodes, positionValue));
            break;
        }
      }
    }
    return parameters;
  }

  processCodes(state: ProgramState) : ProgramState {
    for (let index = state.index; index < state.opcodes.length; ) {
      state.index = index;

      const code = state.opcodes[index];
      const commandCode = code % 100;
      const modeCodes = Math.floor(code / 100);
      let targetIndex: number;
      
      switch (commandCode){
        case 1:
          this.processAddition(state.opcodes, this.getParameters(state, index, 3, modeCodes));
          index += 4;
          break;
        case 2:
          this.processMultiplication(state.opcodes, this.getParameters(state, index, 3, modeCodes));
          index += 4;
          break;
        case 3:
          if (this.processInput(state.opcodes, this.getParameters(state, index, 1, modeCodes))) {
            index += 2;
          } else {
            state.haltReason = HaltReason.outOfInput;
            return state;
          }
          break;
        case 4:
          this.processOutput(this.getParameters(state, index, 1, modeCodes, false));
          index += 2;
          break;
        case 5:
          targetIndex = this.processJumpIfTrue(this.getParameters(state, index, 2, modeCodes, false));
          if (targetIndex !== undefined) {
            index = targetIndex;
          } else {
            index += 3;
          }
          break;
        case 6:
          targetIndex = this.processJumpIfFalse(this.getParameters(state, index, 2, modeCodes, false));
          if (targetIndex !== undefined) {
            index = targetIndex;
          } else {
            index += 3;
          }
          break;
        case 7:
          this.processLessThan(state.opcodes, this.getParameters(state, index, 3, modeCodes));
          index += 4;
          break;
        case 8:
          this.processEquals(state.opcodes, this.getParameters(state, index, 3, modeCodes));
          index += 4;
          break;
        case 9:
          this.processRelativeBaseAdjustment(state, this.getParameters(state, index, 1, modeCodes, false));
          index += 2;
          break;
        case 99:
          state.haltReason = HaltReason.terminated;
          return state;
        default:
          index += 1;
          break;
      }
    }
    
    state.haltReason = HaltReason.outOfCommands;
    return state;
  }
}
