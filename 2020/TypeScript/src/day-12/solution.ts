import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

enum Action {
  north = 'N',
  south = 'S',
  east = 'E',
  west = 'W',
  left = 'L',
  right = 'R',
  forward = 'F',
}

interface Instruction {
  action: Action;
  amount: number;
}

enum Direction {
  north,
  south,
  east,
  west
}

class PositionState {
  readonly northSouthPosition: number;
  readonly eastWestPosition: number;
  readonly direction: Direction;

  private static rotateLeft(direction: Direction) {
    switch (direction) {
      case Direction.north:
        return Direction.west;
      case Direction.west:
        return Direction.south;
      case Direction.south:
        return Direction.east;
      case Direction.east:
        return Direction.north;
    }
  }

  private static rotateRight(direction: Direction) {
    switch (direction) {
      case Direction.north:
        return Direction.east;
      case Direction.east:
        return Direction.south;
      case Direction.south:
        return Direction.west;
      case Direction.west:
        return Direction.north;
    }
  }

  private turn(degrees: number, rotationFunction: (direction: Direction) => Direction) {
    let turnsToPerform = degrees / 90;
    let newDirection = this.direction;

    while (turnsToPerform > 0) {
      newDirection = rotationFunction(newDirection);
      turnsToPerform -= 1;
    }

    return new PositionState(this.northSouthPosition, this.eastWestPosition, newDirection);
  }

  constructor(northSouthPosition = 0, eastWestPosition = 0, direction: Direction = Direction.east) {
    this.northSouthPosition = northSouthPosition;
    this.eastWestPosition = eastWestPosition;
    this.direction = direction;
  }

  moveEast(amount: number) {
    return new PositionState(this.northSouthPosition, this.eastWestPosition + amount, this.direction);
  }

  moveWest(amount: number) {
    return new PositionState(this.northSouthPosition, this.eastWestPosition - amount, this.direction);
  }

  moveNorth(amount: number) {
    return new PositionState(this.northSouthPosition + amount, this.eastWestPosition, this.direction);
  }

  moveSouth(amount: number) {
    return new PositionState(this.northSouthPosition - amount, this.eastWestPosition, this.direction);
  }

  moveForward(amount: number) {
    switch (this.direction) {
      case Direction.north:
        return this.moveNorth(amount);
      case Direction.south:
        return this.moveSouth(amount);
      case Direction.east:
        return this.moveEast(amount);
      case Direction.west:
        return this.moveWest(amount);
    }
  }

  turnLeft(degrees: number) {
    return this.turn(degrees, PositionState.rotateLeft);
  }

  turnRight(degrees: number) {
    return this.turn(degrees, PositionState.rotateRight);
  }
}

export class Solution extends FileInputChallenge {
  private static parseInstrction(value: string): Instruction {
    return {
      action: value[0] as Action,
      amount: parseInt(value.substring(1))
    };
  }

  private parseInstructions(): Instruction[] {
    return this.lines.map(Solution.parseInstrction);
  }

  private static moveShip(currentPosition: PositionState, instruction: Instruction) {
    switch (instruction.action) {
      case Action.east:
        return currentPosition.moveEast(instruction.amount);
      case Action.west:
        return currentPosition.moveWest(instruction.amount);
      case Action.north:
        return currentPosition.moveNorth(instruction.amount);
      case Action.south:
        return currentPosition.moveSouth(instruction.amount);
      case Action.forward:
        return currentPosition.moveForward(instruction.amount);
      case Action.left:
        return currentPosition.turnLeft(instruction.amount);
      case Action.right:
        return currentPosition.turnRight(instruction.amount);
    }
  }

  private distanceFromOrigin(positionState: PositionState) {
    return Math.abs(positionState.northSouthPosition) + Math.abs(positionState.eastWestPosition);
  }

  private runUntilDone() {
    const instructions = this.parseInstructions();
    let positionState = new PositionState();
    instructions.forEach(instruction => {
      positionState = Solution.moveShip(positionState, instruction);
    });
    return positionState;
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 12;
  }

  partOne(): void {
    const finalPosition = this.runUntilDone();
    const distance = this.distanceFromOrigin(finalPosition);
    console.log(`The Manhatten distance is ${distance}`);
  }

  partTwo(): void {
  }
}
