import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

enum PositionState {
  floor,
  empty,
  occupied
}

interface RuleSet {
  adjacentOnly: boolean;
  occupiedThreshold: number;
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

  private nextByLineOfSight(position: Position, rowShift: number, columnShift: number, maximumDistance?: number): Position | null {
    let currentPostion = position;
    let distance = 0;
    while (currentPostion != null) {
      const row = currentPostion.row + rowShift;
      const column = currentPostion.column + columnShift;

      if (row < 0 || row >= this.grid.length) {
        return null;
      }
      if (column < 0 || column >= this.grid.length) {
        return null;
      }
      
      currentPostion = this.grid[row][column];
      distance += 1;
      if (currentPostion && currentPostion.state !== PositionState.floor) {
        return currentPostion;
      }

      if (maximumDistance && (distance === maximumDistance)) {
        return null;
      }
    }
    
    return null;
  }

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

  neighborsOf(position: Position, ruleSet: RuleSet): Position[] {
    const neighbors = [];

    const directionalShifts = [-1, 0, 1];
    directionalShifts.forEach(rowShift => {
      directionalShifts.forEach(columnShift => {
        if (rowShift === 0 && columnShift === 0) {
          return;
        }

        const nextInLine = this.nextByLineOfSight(position, rowShift, columnShift, ruleSet.adjacentOnly ? 1 : null);
        if (nextInLine) {
          neighbors.push(nextInLine);
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
  readonly ruleSet: RuleSet;

  private determineNewStates() {
    return this.layout.positions.map(position => {
      const neighbors = this.layout.neighborsOf(position, this.ruleSet);
      const filledNeighbors = neighbors.filter(neighbor => neighbor.state === PositionState.occupied);

      let newState = position.state;
      if (position.state === PositionState.empty && filledNeighbors.length === 0) {
        newState = PositionState.occupied;
      }
      else if (position.state === PositionState.occupied && filledNeighbors.length >= this.ruleSet.occupiedThreshold) {
        newState = PositionState.empty;
      }

      return new Position(newState, position.row, position.column);
    });
  }

  constructor(layout: Layout, ruleSet: RuleSet, stepNumber = 0) {
    this.layout = layout;
    this.ruleSet = ruleSet;
    this.stepNumber = stepNumber;
  }

  step(): LayoutState {
    const newLayout = new Layout();
    this.determineNewStates().forEach(position => {
      newLayout.addPosition(position);
    });

    const nextState = new LayoutState(newLayout, this.ruleSet, this.stepNumber + 1);

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
  private runUntilDone(ruleSet: RuleSet): LayoutState {
    const layout = LayoutParser.parse(this.lines);
    const initialState = new LayoutState(layout, ruleSet);

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
    const finalState = this.runUntilDone({ adjacentOnly: true, occupiedThreshold: 4 });
    const occupiedSeats = finalState.layout.positions.filter(position => position.state === PositionState.occupied).length;

    console.log(`It took ${finalState.stepNumber} steps to reach a stable state of ${occupiedSeats} occupied seats`);
  }

  partTwo(): void {
    const finalState = this.runUntilDone({ adjacentOnly: false, occupiedThreshold: 5 });
    const occupiedSeats = finalState.layout.positions.filter(position => position.state === PositionState.occupied).length;

    console.log(`It took ${finalState.stepNumber} steps to reach a stable state of ${occupiedSeats} occupied seats`);
  }
}
