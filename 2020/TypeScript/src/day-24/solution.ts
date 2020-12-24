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
interface HexagonalPosition {
  a: number;
  r: number;
  c: number;
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
  private static getNextPosition(position: HexagonalPosition, direction: Direction): HexagonalPosition {
    const { a, r, c } = position;

    switch (direction) {
      case Direction.east:
        return { a, r, c: c + 1 };
      case Direction.southeast:
        return { a: 1 - a, r: r + a, c: c + a };
      case Direction.southwest:
        return { a: 1 - a, r: r + a, c: c - (1 - a) };
      case Direction.west:
        return { a, r, c: c - 1 };
      case Direction.northwest:
        return { a: 1 - a, r: r - (1 - a), c: c - (1 - a) };
      case Direction.northeast:
        return { a: 1 - a, r: r - (1 - a), c: c + a };
    }
  }

  static arrange(instructions: Queue<Direction>[]): HexagonalGrid {
    const grid = new HexagonalGrid();
    const referenceTile = { a: 0, r: 0, c: 0 } as HexagonalPosition;

    instructions.forEach(instruction => {
      let currentPosition = referenceTile;
      while (!instruction.isEmpty()) {
        currentPosition = this.getNextPosition(currentPosition, instruction.dequeue());
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
