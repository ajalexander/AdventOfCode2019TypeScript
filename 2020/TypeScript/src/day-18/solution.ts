import { FileInputChallenge } from "../common/dayChallenge";

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

class Stack<T> {
  private collection: T[];

  constructor() {
    this.collection = [];
  }

  isEmpty() {
    return this.collection.length === 0;
  }

  push(item: T) {
    this.collection.push(item);
  }

  peek(): T {
    return this.collection[this.collection.length - 1];
  }

  pop(): T {
    return this.collection.pop();
  }
}

class InfixToPostfixConverter {
  private static precedence(operator: string) {
    switch (operator) {
      case '*':
        return 1;
      case '+':
        return 1;
      default:
        return 0;
    }
  }

  private static isNumeric(current: string) {
    return !isNaN(parseInt(current));
  }

  private static isOperator(current: string) {
    return !!current.match(/[+*]/);
  }

  private static isLeftParenthesis(current: string) {
    return current === '(';
  }

  private static isRightParenthesis(current: string) {
    return current === ')';
  }

  static convert(input: string) {
    const operatorStack = new Stack<string>();
    const postfixCollection = [];

    for (let i = 0; i < input.length; i += 1) {
      const current = input.charAt(i);
      if (InfixToPostfixConverter.isNumeric(current)) {
        postfixCollection.push(current);
      } else if (InfixToPostfixConverter.isOperator(current)) {
        while (!operatorStack.isEmpty() && !InfixToPostfixConverter.isLeftParenthesis(operatorStack.peek()) && InfixToPostfixConverter.precedence(operatorStack.peek()) >= InfixToPostfixConverter.precedence(current)) {
          postfixCollection.push(operatorStack.pop());
        }
        operatorStack.push(current);
      } else if (InfixToPostfixConverter.isLeftParenthesis(current)) {
        operatorStack.push(current);
      } else if (InfixToPostfixConverter.isRightParenthesis(current)) {
        while (!operatorStack.isEmpty() && !InfixToPostfixConverter.isLeftParenthesis(operatorStack.peek())) {
          postfixCollection.push(operatorStack.pop());
        }
        operatorStack.pop();
      }
    }

    while (!operatorStack.isEmpty()) {
      postfixCollection.push(operatorStack.pop());
    }

    return postfixCollection;
  }
}

class Solver {
  static solve(postfixCollection: string[]) {
    const stack = new Stack<number>();

    for (let i = 0; i < postfixCollection.length; i += 1) {
      const current = postfixCollection[i];

      switch (current) {
        case '+':
          stack.push(stack.pop() + stack.pop());
          break;
        case '*':
          stack.push(stack.pop() * stack.pop());
          break;
        default:
          stack.push(parseInt(current));
          break;
      }
    }

    return stack.pop();
  }
}

export class Solution extends FileInputChallenge {
  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 18;
  }

  partOne(): void {
    const converted = this.lines.map(line => InfixToPostfixConverter.convert(line));
    const solved = converted.map(collection => Solver.solve(collection));
    const sumOfSolved = solved.reduce((acc, value) => acc + value, 0);
    console.log(`The sum of the solved expressions is ${sumOfSolved}`);
  }

  partTwo(): void {

  }
}
