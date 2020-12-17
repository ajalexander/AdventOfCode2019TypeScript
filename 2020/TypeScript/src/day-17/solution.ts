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

  points(): number[] {
    const points = [];
    for (let index = this.minimum; index <= this.maximum; index += 1) {
      points.push(index);
    }
    return points;
  }
}

class Dimension {
  readonly dimensionCount: number;
  readonly dimensionRanges: DimensionRange[];

  private shiftedPossibilities() {
    const shift = [-1, 0, 1];

    let current: number[][] = [];
    let previous: number[][] = [];
    for (let dimensionIndex = 0; dimensionIndex < this.dimensionCount; dimensionIndex += 1) {
      previous = current;
      current = [];
      shift.forEach(point => {
        if (previous.length > 0) {
          previous.forEach(previousItem => {
            current.push([...previousItem, point]);
          })
        } else {
          current.push([point]);
        }
      });
    }

    return current.filter(coordinate => !coordinate.every(point => point === 0));
  }

  constructor(dimensionRanges: DimensionRange[]) {
    this.dimensionCount = dimensionRanges.length;
    this.dimensionRanges = dimensionRanges;
  }

  expand(): Dimension {
    return new Dimension(this.dimensionRanges.map(r => r.expand()));
  }

  coordinates() {
    let current: number[][] = [];
    let previous: number[][] = [];
    for (let dimensionIndex = 0; dimensionIndex < this.dimensionCount; dimensionIndex += 1) {
      previous = current;
      current = [];
      this.dimensionRanges[dimensionIndex].points().forEach(point => {
        if (previous.length > 0) {
          previous.forEach(previousItem => {
            current.push([...previousItem, point]);
          })
        } else {
          current.push([point]);
        }
      });
    }

    return current;
  }

  neighborsOf(coordinate: number[]) {
    return this.shiftedPossibilities().map(shift => {
      const neighbor = coordinate.slice();
      shift.forEach((point, index) => {
        neighbor[index] += point;
      });
      return neighbor;
    });
  }
}

class DimensionState {
  readonly currentDimensions: Dimension;
  readonly activePositions: ActivePositions;

  constructor(dimension: Dimension, activePositions: ActivePositions) {
    this.currentDimensions = dimension;
    this.activePositions = activePositions;
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

class ActivePositions {
  private readonly activePositions: number[][];

  constructor(activePositions: number[][] = []) {
    this.activePositions = activePositions.slice();
  }

  isActive(coordinate: number[]) {
    return this.activePositions.some(other => {
      for (let index = 0; index < other.length; index += 1) {
        if (coordinate[index] !== other[index]) {
          return false;
        }
      }
      return true;
    });
  }

  activeCoordinates(): number[][] {
    return this.activePositions;
  }
}

class InputParser {
  static buildInitialState(lines: string[], dimensions: number) {
    const x = lines[0].length - 1;
    const y = lines.length - 1;

    const activePositions: number[][] = [];

    lines.forEach((line, y) => {
      line.split('').forEach((value, x) => {
        if (value === '#') {
          const coordinate = [x, y];
          for (let i = 3; i <= dimensions; i += 1) {
            coordinate.push(0);
          }
          activePositions.push(coordinate);
        }
      });
    });

    const ranges = [
      new DimensionRange(0, x),
      new DimensionRange(0, y),
      
    ];
    for (let i = 3; i <= dimensions; i += 1) {
      ranges.push(new DimensionRange(0, 0));
    }

    const initialDimension = new Dimension(
      ranges
    );

    const initialActivePostions = new ActivePositions(activePositions);

    return new DimensionState(initialDimension, initialActivePostions);
  }
}

export class Solution extends FileInputChallenge {
  private runSteps(targetCount: number, dimensionSize: number) {
    let state = InputParser.buildInitialState(this.lines, dimensionSize);

    for (let i = 0; i < targetCount; i+= 1) {
      state = state.step();
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
    const finalState = this.runSteps(6, 3);
    const activeCoordinates = finalState.activePositions.activeCoordinates();
    const activeCoordinateCount = activeCoordinates.length;

    console.log(`There are ${activeCoordinateCount} active cubes`);
  }

  partTwo(): void {
    const finalState = this.runSteps(6, 4);
    const activeCoordinates = finalState.activePositions.activeCoordinates();
    const activeCoordinateCount = activeCoordinates.length;

    console.log(`There are ${activeCoordinateCount} active cubes`);
  }
}
