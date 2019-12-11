export class CodeProcessor {
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

  processCodeString(codeString: string): string {
    const codeArray = codeString.split(',').map(s => parseInt(s.trim()));
    const processedArray = this.processCodes(codeArray);
    return processedArray.map(i => i.toString()).join(',');
  }

  processCodes(opcodes: number[]) : number[] {
    for (let index = 0; index < opcodes.length; index += 4) {
      const code = opcodes[index];
      switch (code){
        case 1:
          this.processAddition(opcodes, index);
          break;
        case 2:
          this.processMultiplication(opcodes, index);
          break;
        case 99:
          return opcodes;
      }
    }
    
    return opcodes;
  }
}
