import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

enum PositionState {
  floor,
  empty,
  occupied
}

class Position {
  readonly state: PositionState;
  readonly row: number;
  readonly column: number;

  constructor(state: PositionState, row: number, column: number) {
    this.state = state;
    this.row = row;
    this.column = column;
  }

  toString() {
    switch (this.state) {
      case PositionState.empty:
        return 'L';
      case PositionState.occupied:
        return '#';
      default:
        return '.';
    }
  }
}

class Layout {
  readonly positions: Position[];
  readonly grid: Position[][];

  constructor() {
    this.positions = [];
    this.grid = [];
  }

  addPosition(position: Position) {
    this.positions.push(position);
    if (!this.grid[position.row]) {
      this.grid[position.row] = [];
    }
    this.grid[position.row][position.column] = position;
  }

  toString() {
    return this.grid.map(row => row.map(position => position.toString()).join('')).join('\n');
    
  }

  neighborsOf(position: Position): Position[] {
    const neighbors = [];

    const neighborRange = [-1, 0, 1];
    neighborRange.forEach(rowShift => {
      neighborRange.forEach(columnShift => {
        if (rowShift === 0 && columnShift === 0) {
          return;
        }

        const row = position.row + rowShift;
        const column = position.column + columnShift;

        if (this.grid[row] && this.grid[row][column]) {
          neighbors.push(this.grid[row][column]);
        }
      });
    });

    return neighbors;
  }

  print() {
    console.log(this.toString());
  }
}

class LayoutState {
  readonly layout: Layout;
  readonly stepNumber: number;

  private determineNewStates() {
    return this.layout.positions.map(position => {
      const neighbors = this.layout.neighborsOf(position);
      const filledNeighbors = neighbors.filter(neighbor => neighbor.state === PositionState.occupied);

      let newState = position.state;
      if (position.state === PositionState.empty && filledNeighbors.length === 0) {
        newState = PositionState.occupied;
      }
      else if (position.state === PositionState.occupied && filledNeighbors.length >= 4) {
        newState = PositionState.empty;
      }

      return new Position(newState, position.row, position.column);
    });
  }

  constructor(layout: Layout, stepNumber = 0) {
    this.layout = layout;
    this.stepNumber = stepNumber;
  }

  step(): LayoutState {
    const newLayout = new Layout();
    this.determineNewStates().forEach(position => {
      newLayout.addPosition(position);
    });

    const nextState = new LayoutState(newLayout, this.stepNumber + 1);

    // nextState.print();

    return nextState;
  }

  print() {
    console.log('|--------------------------------------------|');
    console.log(`| State after ${this.stepNumber} transitions |`);
    console.log('|--------------------------------------------|');
    console.log();
    this.layout.print();
    console.log();
  }
}

class LayoutParser {
  private static determineState(value: string): PositionState {
    switch (value) {
      case 'L':
        return PositionState.empty;
      case '#':
        return PositionState.occupied;
      default:
        return PositionState.floor;
    }
  }

  static parse(definition: string[]): Layout {
    const layout = new Layout();

    definition.forEach((row, rowIndex) => {
      row.split('').forEach((value, columnIndex) => {
        layout.addPosition(new Position(LayoutParser.determineState(value), rowIndex, columnIndex));
      });
    });

    return layout;
  }
}

export class Solution extends FileInputChallenge {
  private runUntilDone(): LayoutState {
    const layout = LayoutParser.parse(this.lines);
    const initialState = new LayoutState(layout);

    let currentState = initialState;
    let previousState: LayoutState;

    do {
      previousState = currentState;
      currentState = currentState.step();
    } while (currentState.layout.toString() !== previousState.layout.toString());
    
    return previousState;
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 11;
  }

  partOne(): void {
    const finalState = this.runUntilDone();
    const occupiedSeats = finalState.layout.positions.filter(position => position.state === PositionState.occupied).length;

    console.log(`It took ${finalState.stepNumber} steps to reach a stable state of ${occupiedSeats} occupied seats`);
  }

  partTwo(): void {

  }
}