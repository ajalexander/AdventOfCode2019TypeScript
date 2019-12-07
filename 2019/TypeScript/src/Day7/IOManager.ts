import * as readlineSync from 'readline-sync';

export interface IOManager {
  input() : number;
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
    console.log(`Returning ${value} as an input`);
    return value;
  }

  output(value: number) {
    console.log(`Storing ${value} as an output`);
    this.outputBuffer.push(value);
  }
}

export class AlternatingInputOutputIOManager extends InMemoryBufferIOManager {
  baseMode: boolean = true;

  reset() {
    super.reset();
    this.baseMode = true;
  }

  input() : number {
    let value : number;
    
    if (this.baseMode) {
      value = super.input();
    } else {
      value = this.outputBuffer.shift() || 0;
      console.log(`Returning ${value} as an input (from the output buffer)`);
    }
    
    this.baseMode = !this.baseMode;

    return value;
  }
}

export class CommandLineIOManager implements IOManager {
  private standardInput = process.stdin;

  constructor() {
    this.standardInput.setEncoding('utf-8');
  }

  input() : number {
    return readlineSync.questionInt('Input Value: ');
  }

  output(value: number) {
    console.log(`Output Value: ${value}`);
  }
}
