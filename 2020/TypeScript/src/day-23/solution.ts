import { DayChallenge } from "../common/dayChallenge";

// const input = '389125467'; // Example
const input = '215694783'; // Problem Input

const cupCountPerRound = 3;

class Game {
  private cupMapping: Map<number, Cup>;
  private highestOrderedCup: number;
  private moveCount = 0;
  private current: Cup;

  private selectNextCups(): Cup[] {
    let current = this.current;
    const nextCups = [];
    for (let i = 0; i < cupCountPerRound; i += 1) {
      nextCups.push(current.next);
      current = current.next;
    }
    return nextCups;
  }

  private highestPossibleTargetNumber(removedCups: Cup[]): number {
    for (let possible = this.highestOrderedCup; possible > 0; possible -= 1) {
      if (!removedCups.some(removed => removed.number === possible)) {
        return possible;
      }
    }
  }

  private selectNextTarget(removedCups: Cup[]): Cup {
    for (let possible = this.current.number - 1; possible > 0; possible -= 1) {
      if (!removedCups.some(removed => removed.number === possible)) {
        return this.cupMapping.get(possible);
      }
    }

    return this.cupMapping.get(this.highestPossibleTargetNumber(removedCups));
  }

  private spliceOutRemovedCups(removedCups: Cup[]) {
    this.current.setNext(removedCups[cupCountPerRound - 1].next);
  }

  private spliceInRemovedCups(removedCups: Cup[], nextTarget: Cup) {
    removedCups[cupCountPerRound - 1].setNext(nextTarget.next);
    nextTarget.setNext(removedCups[0]);
  }

  constructor(cups: Cup[]) {
    this.current = cups[0];
    this.cupMapping = new Map<number, Cup>();

    cups.forEach(cup => this.cupMapping.set(cup.number, cup));

    const sortedKeys = [...this.cupMapping.keys()].sort((a,b) => a - b);
    this.highestOrderedCup = sortedKeys[this.cupMapping.size - 1];
  }

  takeTurn() {
    this.moveCount += 1;

    // console.log(`-- move ${this.moveCount} --`);
    // console.log(`cups: ${this.toString()}`);
    
    const removedCups = this.selectNextCups();

    // console.log(`pick up: ${removedCups.map(removed => removed.number).join(', ')}`);

    const nextTarget = this.selectNextTarget(removedCups);
    // console.log(`destination: ${nextTarget.number}`);

    this.spliceOutRemovedCups(removedCups);
    this.spliceInRemovedCups(removedCups, nextTarget);

    this.current = this.current.next;

    // console.log();
  }

  toString(): string {
    let current = this.current;
    const stringVersions: string[] = [];

    while (stringVersions.length < this.cupMapping.size) {
      if (current === this.current) {
        stringVersions.push(`(${current.number})`);
      } else {
        stringVersions.push(current.number.toString());
      }
      current = current.next;
    }

    return stringVersions.join(' ');
  }

  play(rounds = 10) {
    for (let i = 0; i < rounds; i += 1) {
      // const currentState = this.currentState();
      // const previousIndexForState = this.previousRounds.findIndex(roundState => {
      //   return roundState.equals(currentState);
      // });

      // if (previousIndexForState) {

      // }
      // this.previousRounds.push(currentState);
      this.takeTurn();
    }
  }

  finalNumber(): number {
    let current = this.getCup(1).next;
    const pieces = [];
    while (pieces.length < this.cupMapping.size - 1) {
      pieces.push(current.number);
      current = current.next;
    }

    return parseInt(pieces.join(''));
  }

  getCup(cupNumber: number): Cup {
    return this.cupMapping.get(cupNumber);
  }
}

class Cup {
  readonly number: number;
  previous: Cup;
  next: Cup;

  constructor(number: number) {
    this.number = number;
  }

  setNext(next: Cup) {
    this.next = next;
    next.previous = this;
  }
}

export class Solution extends DayChallenge {
  private setupGame(input: string, maximumValues?: number) {
    const cups = input.split('').map(s => new Cup(parseInt(s)));

    if (maximumValues) {
      const maximumAlreadyIncluded = cups.map(cup => cup.number).sort()[cups.length - 1];
      for (let i = maximumAlreadyIncluded + 1; i <= maximumValues; i += 1) {
        cups.push(new Cup(i));
      }
    }

    cups.forEach((cup, index) => {
      const nextIndex = index < cups.length - 1 ? index + 1 : 0;
      cup.setNext(cups[nextIndex]);
    });

    return new Game(cups);
  }

  dayNumber(): number {
    return 23;
  }

  partOne(): void {
    const game = this.setupGame(input);
    game.play(100);

    const finalNumber = game.finalNumber();

    console.log(`The final labels are ${finalNumber}`);
  }

  partTwo(): void {
    const game = this.setupGame(input, 1000000);
    game.play(10000000);

    const nextCups = [game.getCup(1).next, game.getCup(1).next.next];

    const product = nextCups.reduce((acc, cup) => acc * cup.number, 1);

    console.log(`The product of the previous cups (${nextCups[0].number} and ${nextCups[1].number}) is ${product}`);
  }

}