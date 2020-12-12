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

class Position {
  readonly northSouth: number;
  readonly eastWest: number;

  constructor(northSouth: number, eastWest: number) {
    this.northSouth = northSouth;
    this.eastWest = eastWest;
  }
}

interface PositionState {
  position: Position;

  moveEast(amount: number);
  moveWest(amount: number);
  moveNorth(amount: number);
  moveSouth(amount: number);
  moveForward(amount: number);
  turnLeft(degrees: number);
  turnRight(degrees: number);
}

class ShipOnlyPositionState implements PositionState {
  readonly position: Position;
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

    return new ShipOnlyPositionState(new Position(this.position.northSouth, this.position.eastWest), newDirection);
  }

  constructor(position = new Position(0, 0), direction: Direction = Direction.east) {
    this.position = position;
    this.direction = direction;
  }

  moveEast(amount: number) {
    return new ShipOnlyPositionState(new Position(this.position.northSouth, this.position.eastWest + amount), this.direction);
  }

  moveWest(amount: number) {
    return new ShipOnlyPositionState(new Position(this.position.northSouth, this.position.eastWest - amount), this.direction);
  }

  moveNorth(amount: number) {
    return new ShipOnlyPositionState(new Position(this.position.northSouth + amount, this.position.eastWest), this.direction);
  }

  moveSouth(amount: number) {
    return new ShipOnlyPositionState(new Position(this.position.northSouth - amount, this.position.eastWest), this.direction);
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
    return this.turn(degrees, ShipOnlyPositionState.rotateLeft);
  }

  turnRight(degrees: number) {
    return this.turn(degrees, ShipOnlyPositionState.rotateRight);
  }
}

class WaypointBasedPositionState implements PositionState {
  readonly position: Position;
  readonly relativeWaypointPosition: Position;

  private static rotateLeft(relativePosition: Position) {
    return new Position(relativePosition.eastWest, relativePosition.northSouth * -1);
  }

  private static rotateRight(relativePosition: Position) {
    return new Position(relativePosition.eastWest * -1, relativePosition.northSouth);
  }

  private turn(degrees: number, rotationFunction: (relativePosition: Position) => Position) {
    let turnsToPerform = degrees / 90;
    let newWaypointPosition = this.relativeWaypointPosition;

    while (turnsToPerform > 0) {
      newWaypointPosition = rotationFunction(newWaypointPosition);
      turnsToPerform -= 1;
    }

    return new WaypointBasedPositionState(this.position, newWaypointPosition);
  }

  constructor(position = new Position(0, 0), relativeWaypointPosition = new Position(1, 10)) {
    this.position = position;
    this.relativeWaypointPosition = relativeWaypointPosition;
  }

  moveEast(amount: number) {
    return new WaypointBasedPositionState(this.position , new Position(this.relativeWaypointPosition.northSouth, this.relativeWaypointPosition.eastWest + amount));
  }

  moveWest(amount: number) {
    return new WaypointBasedPositionState(this.position, new Position(this.relativeWaypointPosition.northSouth, this.relativeWaypointPosition.eastWest - amount));
  }

  moveNorth(amount: number) {
    return new WaypointBasedPositionState(this.position, new Position(this.relativeWaypointPosition.northSouth + amount, this.relativeWaypointPosition.eastWest));
  }

  moveSouth(amount: number) {
    return new WaypointBasedPositionState(this.position, new Position(this.relativeWaypointPosition.northSouth - amount, this.relativeWaypointPosition.eastWest));
  }

  moveForward(amount: number) {
    const northSouthShift = this.relativeWaypointPosition.northSouth * amount;
    const eastWestShift = this.relativeWaypointPosition.eastWest * amount;

    return new WaypointBasedPositionState(new Position(this.position.northSouth + northSouthShift, this.position.eastWest + eastWestShift), this.relativeWaypointPosition);
  }

  turnLeft(degrees: number) {
    return this.turn(degrees, WaypointBasedPositionState.rotateLeft);
  }

  turnRight(degrees: number) {
    return this.turn(degrees, WaypointBasedPositionState.rotateRight);
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
    return Math.abs(positionState.position.northSouth) + Math.abs(positionState.position.eastWest);
  }

  private runUntilDone(startingState: PositionState) {
    const instructions = this.parseInstructions();
    let positionState = startingState;
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
    const finalPosition = this.runUntilDone(new ShipOnlyPositionState());
    const distance = this.distanceFromOrigin(finalPosition);
    console.log(`The Manhatten distance is ${distance}`);
  }

  partTwo(): void {
    const finalPosition = this.runUntilDone(new WaypointBasedPositionState());
    const distance = this.distanceFromOrigin(finalPosition);
    console.log(`The Manhatten distance is ${distance}`);
  }
}
