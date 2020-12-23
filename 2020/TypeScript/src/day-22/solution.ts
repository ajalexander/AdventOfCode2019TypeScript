import { GroupedFileInputChallenge } from "../common/dayChallenge";
import { Queue } from "../common/queue";

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface RoundState {
  player1: Queue<number>;
  player2: Queue<number>;
}

enum GameMode {
  normal,
  recursive,
}

enum Player {
  player1,
  player2,
}

interface RoundResult {
  gameOver: boolean;
  winner: Player;
}

class GameState {
  readonly player1Deck: Queue<number>;
  readonly player2Deck: Queue<number>;
  readonly gameMode: GameMode;
  readonly previousRounds: RoundState[];

  private alreadyPlayed() {
    return this.previousRounds.some(round => round.player1.equivalent(this.player1Deck) && round.player2.equivalent(this.player2Deck));
  }

  private assessComparisonResults(player1Card: number, player2Card: number): RoundResult {
    if (player1Card > player2Card) {
      this.player1Deck.enqueue(player1Card);
      this.player1Deck.enqueue(player2Card);
      return { winner: Player.player1, gameOver: false };
    } else {
      this.player2Deck.enqueue(player2Card);
      this.player2Deck.enqueue(player1Card);
      return { winner: Player.player2, gameOver: false };
    }
  }

  private isGameOverDueToEmptyDeck() {
    return this.player1Deck.isEmpty() || this.player2Deck.isEmpty();
  }

  private isGameOverDueToExitCondition(result: RoundResult) {
    return result && result.gameOver;
  }

  constructor(player1Deck: Queue<number>, player2Deck: Queue<number>, gameMode: GameMode) {
    this.player1Deck = player1Deck;
    this.player2Deck = player2Deck;
    this.gameMode = gameMode;
    this.previousRounds = [];
  }

  playUntilDone(): RoundResult {
    let lastRoundResult: RoundResult;
    while (!this.isGameOverDueToEmptyDeck() && !this.isGameOverDueToExitCondition(lastRoundResult)) {
      lastRoundResult = this.takeTurn();
    }
    return lastRoundResult;
  }

  takeTurn(): RoundResult {
    if (this.gameMode === GameMode.recursive && this.alreadyPlayed()) {
      return { winner: Player.player1, gameOver: true };
    }

    this.previousRounds.push({
      player1: this.player1Deck.clone(),
      player2: this.player2Deck.clone(),
    });
  
    const player1Card = this.player1Deck.dequeue();
    const player2Card = this.player2Deck.dequeue();

    if (this.gameMode === GameMode.recursive) {
      if (this.player1Deck.size() >= player1Card && this.player2Deck.size() >= player2Card) {
        const subgameState = new GameState(this.player1Deck.cloneToDepth(player1Card), this.player2Deck.cloneToDepth(player2Card), this.gameMode);
        const result = subgameState.playUntilDone();

        if (result.winner === Player.player1) {
          this.player1Deck.enqueue(player1Card);
          this.player1Deck.enqueue(player2Card);
        } else {
          this.player2Deck.enqueue(player2Card);
          this.player2Deck.enqueue(player1Card);
        }

        return { winner: result.winner, gameOver: false };
      } else {
        return this.assessComparisonResults(player1Card, player2Card);
      }
    } else {
      return this.assessComparisonResults(player1Card, player2Card);
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

  static setupGame(groups: string[][], gameMode: GameMode) {
    const player1Deck = this.buildDeck(groups[0].slice(1));
    const player2Deck = this.buildDeck(groups[1].slice(1));

    return new GameState(player1Deck, player2Deck, gameMode);
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
    const gameState = GameParser.setupGame(this.groups, GameMode.normal);
    gameState.playUntilDone();

    const winningDeck = gameState.winningDeck();
    const score = gameState.score(winningDeck.clone());

    console.log(`The winning player's score is ${score}`);
  }

  partTwo(): void {
    const gameState = GameParser.setupGame(this.groups, GameMode.recursive);
    gameState.playUntilDone();

    const winningDeck = gameState.winningDeck();
    const score = gameState.score(winningDeck.clone());

    console.log(`The winning player's score is ${score}`);
  }
}
