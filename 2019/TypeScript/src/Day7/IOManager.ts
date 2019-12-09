export interface IOManager {
  input() : number | undefined;
  output(value: number);
}

export class InMemoryBufferIOManager implements IOManager {
  inputBuffer : number[];
  outputBuffer : number[];

  constructor() {
    this.inputBuffer = [];
    this.outputBuffer = [];
  }
  
  reset() {
    this.inputBuffer = [];
    this.outputBuffer = [];
  }

  addToInputBuffer(value: number) {
    this.inputBuffer.push(value);
  }

  input() : number {
    const value = this.inputBuffer.shift();
    // console.log(`Returning ${value} as an input`);
    return value;
  }

  output(value: number) {
    // console.log(`Storing ${value} as an output`);
    this.outputBuffer.push(value);
  }
}

export class ChainedIOManager extends InMemoryBufferIOManager {
  feeder: ChainedIOManager;

  constructor(feeder: ChainedIOManager = null) {
    super();
    this.feeder = feeder;
  }

  hasAvailableOutput() {
    return this.outputBuffer.length > 0;
  }

  takeOutput() : number {
    return this.outputBuffer.shift();
  }

  input() : number {
    if (this.inputBuffer.length > 0) {
      return super.input();
    }

    if (this.feeder.hasAvailableOutput()) {
      const value = this.feeder.takeOutput();
      // console.log(`Returning ${value} as an input (from the output buffer)`);
      return value;
    }

    return undefined;
  }
}
