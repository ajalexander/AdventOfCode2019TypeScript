import { IOManager } from "./IOManager";

export class CodeProcessor {
  private ioManager : IOManager;

  constructor(ioManager = new IOManager()) {
    this.ioManager = ioManager;
  }

  private getValue(opcodes: number[], index: number) {
    return opcodes[index];
  }

  private isImmediateParameter(offset: number, modeCodes: number) {
    while (offset > 0) {
      modeCodes = Math.floor(modeCodes / 10);
      offset -= 1;
    }
    return modeCodes % 10 === 1;
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

  private processInput(opcodes: number[], parameters: number[]) {
    const input = this.ioManager.input();
    opcodes[parameters[0]] = input;
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

  private getParameters(opcodes: number[], operationIndex: number, parameterCount: number, modeCodes: number, forceLastParameterMode = true) {
    const parameters = [];

    for (let index = 0; index < parameterCount; index += 1) {
      const isImmediateParameter = this.isImmediateParameter(index, modeCodes);
      const isLastParameter = index === (parameterCount - 1)
      const positionValue = opcodes[operationIndex + index + 1];
      
      if (isImmediateParameter || (forceLastParameterMode && isLastParameter)) {
        parameters.push(positionValue);
      } else {
        parameters.push(this.getValue(opcodes, positionValue))
      }
    }
    return parameters;
  }

  processCodeString(codeString: string): string {
    const codeArray = codeString.split(',').map(s => parseInt(s.trim()));
    const processedArray = this.processCodes(codeArray);
    return processedArray.map(i => i.toString()).join(',');
  }

  processCodes(opcodes: number[]) : number[] {
    for (let index = 0; index < opcodes.length; ) {
      const code = opcodes[index];
      const commandCode = code % 100;
      const modeCodes = Math.floor(code / 100);
      let targetIndex: number;
      
      switch (commandCode){
        case 1:
          this.processAddition(opcodes, this.getParameters(opcodes, index, 3, modeCodes));
          index += 4;
          break;
        case 2:
          this.processMultiplication(opcodes, this.getParameters(opcodes, index, 3, modeCodes));
          index += 4;
          break;
        case 3:
          this.processInput(opcodes, this.getParameters(opcodes, index, 1, modeCodes));
          index += 2;
          break;
        case 4:
          this.processOutput(this.getParameters(opcodes, index, 1, modeCodes, false));
          index += 2;
          break;
        case 5:
          targetIndex = this.processJumpIfTrue(this.getParameters(opcodes, index, 2, modeCodes, false));
          if (targetIndex !== undefined) {
            index = targetIndex;
          } else {
            index += 3;
          }
          break;
        case 6:
          targetIndex = this.processJumpIfFalse(this.getParameters(opcodes, index, 2, modeCodes, false));
          if (targetIndex !== undefined) {
            index = targetIndex;
          } else {
            index += 3;
          }
          break;
        case 7:
          this.processLessThan(opcodes, this.getParameters(opcodes, index, 3, modeCodes));
          index += 4;
          break;
        case 8:
          this.processEquals(opcodes, this.getParameters(opcodes, index, 3, modeCodes));
          index += 4;
          break;
        case 99:
          return opcodes;
        default:
          index += 1;
           break;
      }
    }
    
    return opcodes;
  }
}
