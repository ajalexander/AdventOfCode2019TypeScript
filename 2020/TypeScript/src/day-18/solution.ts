import { FileInputChallenge } from "../common/dayChallenge";
import { Stack } from "../common/stack";

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

class OperatorPrecedenceResolver {
  static normal(operator: string) {
    switch (operator) {
      case '*':
        return 2;
      case '+':
        return 1;
      default:
        return 0;
    }
  }

  static part1(operator: string) {
    switch (operator) {
      case '*':
        return 1;
      case '+':
        return 1;
      default:
        return 0;
    }
  }

  static part2(operator: string) {
    switch (operator) {
      case '*':
        return 1;
      case '+':
        return 2;
      default:
        return 0;
    }
  }
}

class InfixToPostfixConverter {
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

  static convert(input: string, prededenceResolver: (value: string) => number) {
    const operatorStack = new Stack<string>();
    const postfixCollection = [];

    for (let i = 0; i < input.length; i += 1) {
      const current = input.charAt(i);
      if (InfixToPostfixConverter.isNumeric(current)) {
        postfixCollection.push(current);
      } else if (InfixToPostfixConverter.isOperator(current)) {
        while (!operatorStack.isEmpty() && !InfixToPostfixConverter.isLeftParenthesis(operatorStack.peek()) && prededenceResolver(operatorStack.peek()) >= prededenceResolver(current)) {
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
    const converted = this.lines.map(line => InfixToPostfixConverter.convert(line, OperatorPrecedenceResolver.part1));
    const solved = converted.map(collection => Solver.solve(collection));
    const sumOfSolved = solved.reduce((acc, value) => acc + value, 0);
    console.log(`The sum of the solved expressions is ${sumOfSolved}`);
  }

  partTwo(): void {
    const converted = this.lines.map(line => InfixToPostfixConverter.convert(line, OperatorPrecedenceResolver.part2));
    const solved = converted.map(collection => Solver.solve(collection));
    const sumOfSolved = solved.reduce((acc, value) => acc + value, 0);
    console.log(`The sum of the solved expressions is ${sumOfSolved}`);
  }
}
