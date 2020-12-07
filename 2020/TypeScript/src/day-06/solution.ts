import { DayChallenge } from '../common/dayChallenge';
import { FileReader } from '../common/fileUtils';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

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

  private static commonQuestionsForGroup(groupAnswers: string[]) {
    let commonQuestions: string[];
    groupAnswers.forEach(individualAnswers => {
      const answersCollection = individualAnswers.split('');
      if (commonQuestions) {
        commonQuestions = commonQuestions.filter(value => answersCollection.includes(value));
      } else {
        commonQuestions = answersCollection;
      }
    });
    return commonQuestions.sort();
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
    console.log(`There are ${questionsAnswered} questions answered by anyone in group`);
  }

  partTwo(): void {
    const questionsAnswered = this.groups.reduce((acc, groupAnswers) => {
      return acc + Solution.commonQuestionsForGroup(groupAnswers).length;
    }, 0);
    console.log(`There are ${questionsAnswered} questions answered by everyone in group`);
  }
}
