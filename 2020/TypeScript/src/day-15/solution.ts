import { DayChallenge } from "../common/dayChallenge";

// interface Example {
//   input: number[];
//   expectedAnswer: number;
// }

// const examples: Example[] = [
//   { input: [1,3,2], expectedAnswer: 1 },
//   { input: [2,1,3], expectedAnswer: 10 },
//   { input: [1,2,3], expectedAnswer: 27 },
//   { input: [2,3,1], expectedAnswer: 78 },
//   { input: [3,2,1], expectedAnswer: 438 },
//   { input: [3,1,2], expectedAnswer: 1836 },
// ];

const problemInput = [9,3,1,0,8,4];

export class Solution extends DayChallenge {
  // private static runExamples(targetIterationCount: number) {
  //   examples.forEach(example => {
  //     console.log(`Input: ${example.input}; Expected: ${example.expectedAnswer}; Actual: ${Solution.runSequence(example.input, targetIterationCount)}`);
  //   })
  // }

  private static runSequence(input: number[], targetIterationCount: number): number {
    const spokenAnswerMap = new Map<number, number[]>();

    input.forEach((input, index) => spokenAnswerMap.set(input, [index]));
    let previousAnswer = input[input.length - 1];
    let previousAnswerTimes = spokenAnswerMap.get(previousAnswer);

    for (let turn = input.length; turn < targetIterationCount; turn += 1) {
      if (previousAnswerTimes.length > 1) {
        previousAnswer = previousAnswerTimes[1] - previousAnswerTimes[0];
      } else {
        previousAnswer = 0;
      }

      previousAnswerTimes = spokenAnswerMap.get(previousAnswer);
      if (!previousAnswerTimes) {
        previousAnswerTimes = [];
        spokenAnswerMap.set(previousAnswer, previousAnswerTimes);
      }

      if (previousAnswerTimes.length > 1) {
        previousAnswerTimes.shift();
      }
      previousAnswerTimes.push(turn);
    }
    
    return previousAnswer;
  }

  dayNumber(): number {
    return 15;
  }
  partOne(): void {
    // Solution.runExamples(2020);

    const answer = Solution.runSequence(problemInput, 2020);
    console.log(`The 2020th number spoken is: ${answer}`);
  }

  partTwo(): void {
    // Solution.runExamples(30000000);

    const answer = Solution.runSequence(problemInput, 30000000);
    console.log(`The 30000000th number spoken is: ${answer}`);
  }
}
