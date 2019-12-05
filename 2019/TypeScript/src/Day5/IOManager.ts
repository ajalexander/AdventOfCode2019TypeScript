import * as readlineSync from 'readline-sync';

export class IOManager {
  private standardInput = process.stdin;

  constructor() {
    this.standardInput.setEncoding('utf-8');
  }

  input() : number {
    return readlineSync.questionInt('Input Value:');
  }

  output(value: number) {
    console.log(`Output Value: ${value}`);
  }
}