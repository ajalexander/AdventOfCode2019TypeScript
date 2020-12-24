import { FileInputChallenge } from "../common/dayChallenge";
import { Queue } from "../common/queue";

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

enum Color {
  white,
  black,
}

enum Direction {
  east = 'e',
  southeast = 'se',
  southwest = 'sw',
  west = 'w',
  northwest = 'nw',
  northeast = 'ne',
}

// See https://en.wikipedia.org/wiki/Hexagonal_Efficient_Coordinate_System
class HexagonalPosition {
  readonly a: number;
  readonly r: number;
  readonly c: number;

  constructor(a: number, r: number, c: number) {
    this.a = a;
    this.r = r;
    this.c = c;
  }

  next(direction: Direction) {
    switch (direction) {
      case Direction.east:
        return new HexagonalPosition(this.a, this.r, this.c + 1);
      case Direction.southeast:
        return new HexagonalPosition(1 - this.a, this.r + this.a, this.c + this.a);
      case Direction.southwest:
        return new HexagonalPosition(1 - this.a, this.r + this.a, this.c - (1 - this.a));
      case Direction.west:
        return new HexagonalPosition(this.a, this.r, this.c - 1);
      case Direction.northwest:
        return new HexagonalPosition(1 - this.a, this.r - (1 - this.a), this.c - (1 - this.a));
      case Direction.northeast:
        return new HexagonalPosition(1 - this.a, this.r - (1 - this.a), this.c + this.a);
    }
  }
}

class HexagonalGrid {
  private tiles: Set<HexagonalTile>;
  private tilePositions: HexagonalTile[][][];

  private ensureArrayReference(position: HexagonalPosition) {
    if (!this.tilePositions[position.a]) {
      this.tilePositions[position.a] = [];
    }
    if (!this.tilePositions[position.a][position.r]) {
      this.tilePositions[position.a][position.r] = [];
    }
  }

  constructor() {
    this.tilePositions = [];
    this.tiles = new Set<HexagonalTile>();
  }

  getTile(position: HexagonalPosition) {
    this.ensureArrayReference(position);
    let tile = this.tilePositions[position.a][position.r][position.c];
    if (!tile) {
      tile = new HexagonalTile();
      this.tilePositions[position.a][position.r][position.c] = tile;
      this.tiles.add(tile);
    }
    return tile;
  }

  getTiles(): HexagonalTile[] {
    return [...this.tiles];
  }
}

class HexagonalTile {
  readonly position: HexagonalPosition;
  color: Color;

  constructor() {
    this.color = Color.white;
  }

  flip() {
    this.color = this.color === Color.white ? Color.black : Color.white;
  }
}

class TileArranger {
  static arrange(instructions: Queue<Direction>[]): HexagonalGrid {
    const grid = new HexagonalGrid();
    const referenceTile = new HexagonalPosition(0, 0, 0);

    instructions.forEach(instruction => {
      let currentPosition = referenceTile;
      while (!instruction.isEmpty()) {
        currentPosition = currentPosition.next(instruction.dequeue());
      }

      const tile = grid.getTile(currentPosition);
      tile.flip();
    });

    return grid;
  }
}

class InstructionsParser {
  static parse(lines: string[]): Queue<Direction>[] {
    return lines.map(line => {
      const directions = new Queue<Direction>();
      for (let i = 0; i < line.length; i += 1) {
        const twoCharacterMatch = line.substr(i, 2).match(/(ne|nw|se|sw)/);
        if (twoCharacterMatch) {
          directions.enqueue(twoCharacterMatch[1] as Direction);
          i += 1;
        } else {
          directions.enqueue(line[i] as Direction);
        }
      }
      return directions;
    });
  }
}

export class Solution extends FileInputChallenge {
  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 24;
  }

  partOne(): void {
    const instructions = InstructionsParser.parse(this.lines);
    const grid = TileArranger.arrange(instructions);

    const blackTiles = grid.getTiles().filter(tile => tile.color === Color.black);

    console.log(`There are ${blackTiles.length} black tiles`);
  }

  partTwo(): void {
  }
}
