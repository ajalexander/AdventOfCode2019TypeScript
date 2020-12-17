import { FileInputChallenge } from "../common/dayChallenge";

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

class DimensionRange {
  readonly minimum: number;
  readonly maximum: number;

  constructor(minimum: number, maximum: number) {
    this.minimum = minimum;
    this.maximum = maximum;
  }

  expand(): DimensionRange {
    return new DimensionRange(this.minimum - 1, this.maximum + 1);
  }
}

class Dimension {
  readonly x: DimensionRange;
  readonly y: DimensionRange;
  readonly z: DimensionRange;

  constructor(x: DimensionRange, y: DimensionRange, z: DimensionRange) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  expand(): Dimension {
    return new Dimension(this.x.expand(), this.y.expand(), this.z.expand());
  }

  coordinates() {
    const coordinates: Coordinate[] = [];
    for (let z = this.z.minimum; z <= this.z.maximum; z += 1) {
      for (let x = this.z.minimum; x <= this.x.maximum; x += 1) {
        for (let y = this.y.minimum; y <= this.y.maximum; y += 1) {
          coordinates.push({ x, y, z });
        }
      }
    }
    return coordinates;
  }

  neighborsOf(coordinate: Coordinate) {
    const neighbors: Coordinate[] = [];

    const shift = [-1, 0, 1];

    shift.forEach(zShift => {
      shift.forEach(xShift => {
        shift.forEach(yShift => {
          if (zShift === 0 && xShift === 0 && yShift === 0) {
            return;
          }

          neighbors.push({ x: coordinate.x + xShift, y: coordinate.y + yShift, z: coordinate.z + zShift });
        });
      });
    });

    return neighbors;
  }
}

class DimensionState {
  readonly currentDimensions: Dimension;
  readonly activePositions: ActivePositions;

  constructor(dimension: Dimension, activePositions: ActivePositions) {
    this.currentDimensions = dimension;
    this.activePositions = activePositions;
  }

  print() {
    for (let zIndex = this.currentDimensions.z.minimum; zIndex <= this.currentDimensions.z.maximum; zIndex += 1) {
      console.log(`z=${zIndex}`);
      for (let yIndex = this.currentDimensions.y.minimum; yIndex <= this.currentDimensions.y.maximum; yIndex += 1) {
        const rowValues = [];
        for (let xIndex = this.currentDimensions.x.minimum; xIndex <= this.currentDimensions.x.maximum; xIndex += 1) {
          if (this.activePositions.isActive({ x: xIndex, y: yIndex, z: zIndex })) {
            rowValues.push('#');
          } else {
            rowValues.push('.');
          }
        }
        console.log(rowValues.join(''));
      }
      console.log();
    }
    console.log();
    console.log();
  }

  step() {
    const activeForNextState = [];

    const newDimension = this.currentDimensions.expand();
    const coordinates = newDimension.coordinates();

    coordinates.forEach(coordinate => {
      const neighbors = newDimension.neighborsOf(coordinate);
      const activeNeighborCount = neighbors.filter(neighbor => this.activePositions.isActive(neighbor)).length;

      if (this.activePositions.isActive(coordinate)) {
        if (activeNeighborCount === 2 || activeNeighborCount === 3) {
          activeForNextState.push(coordinate);
        }
      } else {
        if (activeNeighborCount === 3) {
          activeForNextState.push(coordinate);
        }
      }
    });

    const newActivePositions = new ActivePositions(activeForNextState);

    return new DimensionState(newDimension, newActivePositions);
  }
}

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

class ActivePositions {
  private readonly activePositions: Coordinate[];

  constructor(activePositions: Coordinate[] = []) {
    this.activePositions = activePositions.slice();
  }

  isActive(coordinate: Coordinate) {
    return this.activePositions.some(other => other.z === coordinate.z && other.x === coordinate.x && other.y === coordinate.y);
  }

  activeCoordinates(): Coordinate[] {
    return this.activePositions.slice();
  }
}

class InputParser {
  static buildInitialState(lines: string[]) {
    const x = lines[0].length - 1;
    const y = lines.length - 1;

    const activePostions: Coordinate[] = [];

    lines.forEach((line, y) => {
      line.split('').forEach((value, x) => {
        if (value === '#') {
          activePostions.push({ x, y, z: 0 });
        }
      });
    });

    const initialDimension = new Dimension(
      new DimensionRange(0, x),
      new DimensionRange(0, y),
      new DimensionRange(0, 0)
    );

    const initialActivePostions = new ActivePositions(activePostions);

    return new DimensionState(initialDimension, initialActivePostions);
  }
}

export class Solution extends FileInputChallenge {
  private runSteps(targetCount: number) {
    let state = InputParser.buildInitialState(this.lines);

    // console.log('Initial state');
    // state.print();

    for (let i = 0; i < targetCount; i+= 1) {
      state = state.step();

      // console.log(`After ${i + 1} steps`);
      // state.print();
    }

    return state;
  }
  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 17;
  }

  partOne(): void {
    const finalState = this.runSteps(6);
    const activeCoordinates = finalState.activePositions.activeCoordinates();
    const activeCoordinateCount = activeCoordinates.length;

    console.log(`There are ${activeCoordinateCount} active cubes`);
  }

  partTwo(): void {

  }
}
