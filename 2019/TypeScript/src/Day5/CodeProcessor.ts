import { IOManager } from "./IOManager";

export class CodeProcessor {
  private ioManager : IOManager;

  constructor(ioManager = new IOManager()) {
    this.ioManager = ioManager;
  }

  private getLeftIndex(opcodes: number[], operationIndex: number) : number {
    return this.getValue(opcodes, operationIndex + 1);
  }

  private getRightIndex(opcodes: number[], operationIndex: number) : number {
    return this.getValue(opcodes, operationIndex + 2);
  }

  private getTargetIndex(opcodes: number[], operationIndex: number) : number {
    return this.getValue(opcodes, operationIndex + 3);
  }

  private getValue(opcodes: number[], index: number) {
    return opcodes[index];
  }

  private processAddition(opcodes: number[], operationIndex: number) {
    opcodes[this.getTargetIndex(opcodes, operationIndex)] =
      opcodes[this.getLeftIndex(opcodes, operationIndex)] +
      opcodes[this.getRightIndex(opcodes, operationIndex)];
  }

  private processMultiplication(opcodes: number[], operationIndex: number) {
    opcodes[this.getTargetIndex(opcodes, operationIndex)] =
      opcodes[this.getLeftIndex(opcodes, operationIndex)] *
      opcodes[this.getRightIndex(opcodes, operationIndex)];
  }

  private processInput(opcodes: number[], operationIndex: number) {
    const input = this.ioManager.input();
    opcodes[operationIndex + 1] = input;
  }

  private processOutput(opcodes: number[], operationIndex: number) {
    const value = opcodes[opcodes[operationIndex + 1]];
    this.ioManager.output(value);
  }

  processCodeString(codeString: string): string {
    const codeArray = codeString.split(',').map(s => parseInt(s.trim()));
    const processedArray = this.processCodes(codeArray);
    return processedArray.map(i => i.toString()).join(',');
  }

  processCodes(opcodes: number[]) : number[] {
    for (let index = 0; index < opcodes.length; ) {
      const code = opcodes[index];
      console.log(index, code);
      switch (code){
        case 1:
          this.processAddition(opcodes, index);
          index += 4;
          break;
        case 2:
          this.processMultiplication(opcodes, index);
          index += 4;
          break;
        case 3:
          this.processInput(opcodes, index);
          index += 2;
          break;
        case 4:
          this.processOutput(opcodes, index);
          index += 2;
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
