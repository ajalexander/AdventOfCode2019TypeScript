import { DayChallenge } from "../common/dayChallenge";

interface Example {
  input: number[];
  expectedAnswer: number;
}

const examples: Example[] = [
  { input: [1,3,2], expectedAnswer: 1 },
  { input: [2,1,3], expectedAnswer: 10 },
  { input: [1,2,3], expectedAnswer: 27 },
  { input: [2,3,1], expectedAnswer: 78 },
  { input: [3,2,1], expectedAnswer: 438 },
  { input: [3,1,2], expectedAnswer: 1836 },
];

const problemInput = [9,3,1,0,8,4]

interface SpokenAnswerMap {
  [answer: number]: number[];
}

export class Solution extends DayChallenge {
  private static partOneExamples() {
    examples.forEach(example => {
      console.log(`Input: ${example.input}; Expected: ${example.expectedAnswer}; Actual: ${Solution.runSequence(example.input)}`);
    })
  }

  private static runSequence(input: number[]): number {
    const spokenAnswerMap = {} as SpokenAnswerMap;
    input.forEach((input, index) => spokenAnswerMap[input] = [index]);

    let iterationCount = input.length;
    let previousAnswer = input[iterationCount - 1];

    while (iterationCount < 2020) {
      let newAnswer;
      if (spokenAnswerMap[previousAnswer].length > 1) {
        newAnswer = spokenAnswerMap[previousAnswer][0] - spokenAnswerMap[previousAnswer][1];
      } else {
        newAnswer = 0;
      }

      if (!spokenAnswerMap[newAnswer]) {
        spokenAnswerMap[newAnswer] = [];
      }
      spokenAnswerMap[newAnswer].unshift(iterationCount);
      previousAnswer = newAnswer;
      iterationCount += 1;
    }

    return previousAnswer;
  }

  dayNumber(): number {
    return 15;
  }
  partOne(): void {
    Solution.partOneExamples();

    const answer = Solution.runSequence(problemInput);
    console.log(`The 2020th number spoken is: ${answer}`);
  }

  partTwo(): void {
  }
}
