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

  private dimensionValues(selector: (position: HexagonalPosition) => number) {
    const values = [...this.tiles].map(tile => selector(tile.position));
    values.sort((a, b) => a - b);
    return {
      minimum: values[0],
      maximum: values[this.tiles.size - 1],
    };
  }

  constructor() {
    this.tilePositions = [];
    this.tiles = new Set<HexagonalTile>();
  }

  getTile(position: HexagonalPosition): HexagonalTile {
    this.ensureArrayReference(position);
    let tile = this.tilePositions[position.a][position.r][position.c];
    if (!tile) {
      tile = new HexagonalTile(position, this);
      this.tilePositions[position.a][position.r][position.c] = tile;
      this.tiles.add(tile);
    }
    return tile;
  }

  getTiles(): HexagonalTile[] {
    const dimensionA = this.dimensionValues(position => position.a);
    const dimensionR = this.dimensionValues(position => position.r);
    const dimensionC = this.dimensionValues(position => position.c);

    const tiles = [];
    for (let a = dimensionA.minimum; a <= dimensionA.maximum; a += 1) {
      for (let r = dimensionR.minimum; r <= dimensionR.maximum; r += 1) {
        for (let c = dimensionC.minimum; c <= dimensionC.maximum; c += 1) {
          tiles.push(this.getTile(new HexagonalPosition(a, r, c)));
        }
      }
    }
    return tiles;
  }

  adjustColors() {
    const toFlip: HexagonalTile[] = [];

    this.getTiles().forEach(tile => {
      const blackTileNeighbors = tile.getNeighbors().filter(other => other.color === Color.black).length;
      if ((tile.color === Color.black) && (blackTileNeighbors === 0 || blackTileNeighbors > 2)) {
        toFlip.push(tile);
      } else if ((tile.color === Color.white) && (blackTileNeighbors === 2)) {
        toFlip.push(tile);
      }
    });

    toFlip.forEach(tile => tile.flip());
  }

  blackTileCount(): number {
    return this.getTiles().filter(tile => tile.color === Color.black).length;
  }
}

class HexagonalTile {
  private grid: HexagonalGrid;
  private neighbors: HexagonalTile[];
  readonly position: HexagonalPosition;
  color: Color;

  constructor(position: HexagonalPosition, grid: HexagonalGrid) {
    this.position = position;
    this.grid = grid;
    this.color = Color.white;
  }

  flip() {
    this.color = this.color === Color.white ? Color.black : Color.white;
  }

  getNeighbors() {
    if (!this.neighbors) {
      this.neighbors = [
        this.grid.getTile(this.position.next(Direction.east)),
        this.grid.getTile(this.position.next(Direction.southeast)),
        this.grid.getTile(this.position.next(Direction.southwest)),
        this.grid.getTile(this.position.next(Direction.west)),
        this.grid.getTile(this.position.next(Direction.northwest)),
        this.grid.getTile(this.position.next(Direction.northeast)),
      ];
    }
    return this.neighbors;
  }

  next(direction: Direction) {
    const nextPosition = this.position.next(direction);
    return this.grid.getTile(nextPosition);
  }
}

class TileArranger {
  static arrange(instructionSets: Queue<Direction>[]): HexagonalGrid {
    const startingPosition = new HexagonalPosition(0, 0, 0);

    const grid = new HexagonalGrid();
    const startingTile = grid.getTile(startingPosition);

    instructionSets.forEach(instructionSet => {
      let currentTile = startingTile;
      while (!instructionSet.isEmpty()) {
        currentTile = currentTile.next(instructionSet.dequeue());
      }

      currentTile.flip();
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

    console.log(`There are ${grid.blackTileCount()} black tiles`);
  }

  partTwo(): void {
    const instructions = InstructionsParser.parse(this.lines);
    const grid = TileArranger.arrange(instructions);

    const maximumDays = 100;

    for (let day = 1; day <= maximumDays; day += 1) {
      grid.adjustColors();
      // console.log(`There are ${grid.blackTileCount()} black tiles after ${day} days`);
    }

    console.log(`There are ${grid.blackTileCount()} black tiles after ${maximumDays} days`);
  }
}
