import { DayChallenge } from '../common/dayChallenge';
import { FileReader } from '../common/fileUtils';

// const inputPath = './src/day-06/example.txt';
const inputPath = './src/day-06/problemInput.txt';

export class Solution extends DayChallenge {
  private groups: string[][];

  private static uniqueAnswers(answers: string[]) {
    return answers.filter((value, index, self) => self.indexOf(value) === index).sort();
  }

  private static questionsForGroup(groupAnswers: string[]) {
    const combinedAnsweres = groupAnswers
      .join('')
      .split('');
    return Solution.uniqueAnswers(combinedAnsweres);
  }

  constructor() {
    super();
    const reader = new FileReader();
    this.groups = reader.readFileIntoLineGroups(inputPath);
  }

  dayNumber(): number {
    return 6;
  }

  partOne(): void {
    const questionsAnswered = this.groups.reduce((acc, groupAnswers) => {
      return acc + Solution.questionsForGroup(groupAnswers).length;
    }, 0);
    console.log(`There are ${questionsAnswered} unique questions answered`);
  }

  partTwo(): void {
  }
}
