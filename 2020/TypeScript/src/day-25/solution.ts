import { DayChallenge } from "../common/dayChallenge";

const defaultSubject = 7;
const divisor = 20201227;

// const doorPublicKey = 17807724;
// const cardPublicKey = 5764801;

const doorPublicKey = 6929599;
const cardPublicKey = 2448427;

export class Solution extends DayChallenge {
  private transform(subject: number, turns: number) {
    let value = 1;
    for (let i = 1; i <= turns; i += 1) {
      value = (value * subject) % divisor;
    }
    return value;
  }

  private turnsUntilValue(targetNumber: number) {
    let value = 1;
    let turns = 0;
    while (value !== targetNumber) {
      value = (value * defaultSubject) % divisor;
      turns += 1;
    }
    return turns;
  }

  constructor() {
    super();
  }

  dayNumber(): number {
    return 25;
  }

  partOne(): void {
    const cardTurn = this.turnsUntilValue(cardPublicKey);

    const encryptionKey = this.transform(doorPublicKey, cardTurn);

    console.log(`The encryption key is ${encryptionKey}`);
  }

  partTwo(): void {
  }
}
