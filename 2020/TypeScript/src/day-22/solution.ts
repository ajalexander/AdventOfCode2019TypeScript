import { GroupedFileInputChallenge } from "../common/dayChallenge";
import { Queue } from "../common/queue";

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

class GameState {
  readonly player1Deck: Queue<number>;
  readonly player2Deck: Queue<number>;

  constructor(player1Deck: Queue<number>, player2Deck: Queue<number>) {
    this.player1Deck = player1Deck;
    this.player2Deck = player2Deck;
  }

  isGameOver() {
    return this.player1Deck.isEmpty() || this.player2Deck.isEmpty();
  }

  playUntilDone() {
    while (!this.isGameOver()) {
      this.takeTurn();
    }
  }

  takeTurn() {
    const player1Card = this.player1Deck.dequeue();
    const player2Card = this.player2Deck.dequeue();

    if (player1Card > player2Card) {
      this.player1Deck.enqueue(player1Card);
      this.player1Deck.enqueue(player2Card);
    } else {
      this.player2Deck.enqueue(player2Card);
      this.player2Deck.enqueue(player1Card);
    }
  }

  score(deck: Queue<number>): number {
    let accumulatedScore = 0;
    for (let multiplier = deck.size(); multiplier > 0; multiplier -= 1) {
      accumulatedScore += multiplier * deck.dequeue();
    }
    return accumulatedScore;
  }

  winningDeck(): Queue<number> {
    if (!this.player1Deck.isEmpty()) {
      return this.player1Deck;
    }
    return this.player2Deck;
  }
}

class GameParser {
  private static buildDeck(cards: string[]) {
    return new Queue<number>(cards.map(s => parseInt(s)));
  }

  static setupGame(groups: string[][]) {
    const player1Deck = this.buildDeck(groups[0].slice(1));
    const player2Deck = this.buildDeck(groups[1].slice(1));

    return new GameState(player1Deck, player2Deck);
  }
}

export class Solution extends GroupedFileInputChallenge {
  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 22;
  }

  partOne(): void {
    const gameState = GameParser.setupGame(this.groups);
    gameState.playUntilDone();

    const winningDeck = gameState.winningDeck();
    const score = gameState.score(winningDeck.clone());

    console.log(`The winning player's score is ${score}`);
  }

  partTwo(): void {
  }
}