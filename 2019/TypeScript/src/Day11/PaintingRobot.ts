import { InMemoryBufferIOManager } from "./IOManager";
import { CodeProcessor, ProgramState, HaltReason } from './CodeProcessor';

export enum NextOperation {
  paint,
  turn,
}

export enum Color {
  black,
  white
}

export class Point {
  x: number;
  y: number;
  color: Color;
  paintedTimes: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.color = Color.black;
    this.paintedTimes = 0;
  }

  paint(color: Color) {
    // console.log(`Painting {${this.x},${this.y}} to ${color}`);
    this.color = color;
    this.paintedTimes += 1;
  }
}

export class Map {
  points: Point[];

  constructor() {
    this.points = [];
  }

  pointAt(x: number, y: number, insertIfMissing: boolean = true) : Point {
    let point = this.points.find(p => p.x === x && p.y === y);
    if (!point && insertIfMissing) {
      point = new Point(x, y);
      this.points.push(point);
    }
    return point;
  }

  paintedPoints() : Point[] {
    return this.points.filter(point => point.paintedTimes > 0);
  }
}

export enum Direction {
  up,
  right,
  down,
  left
}

export class Robot {
  map: Map;
  currentPoint: Point;
  currentDirection: Direction;

  constructor() {
    this.map = new Map();
    this.currentPoint = this.map.pointAt(0, 0);
    this.currentDirection = Direction.up;
  }

  rotateLeft() {
    switch(this.currentDirection) {
      case Direction.up:
        this.currentDirection = Direction.left;
        break;
      case Direction.left:
        this.currentDirection = Direction.down;
        break;
      case Direction.down:
        this.currentDirection = Direction.right;
        break;
      case Direction.right:
        this.currentDirection = Direction.up;
        break;
    }
  }

  rotateRight() {
    switch(this.currentDirection) {
      case Direction.up:
        this.currentDirection = Direction.right;
        break;
      case Direction.right:
        this.currentDirection = Direction.down;
        break;
      case Direction.down:
        this.currentDirection = Direction.left;
        break;
      case Direction.left:
        this.currentDirection = Direction.up;
        break;
    }
  }

  move() {
    let newX = this.currentPoint.x;
    let newY = this.currentPoint.y;
    switch (this.currentDirection) {
      case Direction.up:
        newY += -1;
        break;
      case Direction.right:
        newX += 1;
        break;
      case Direction.down:
        newY += 1;
        break;
      case Direction.left:
        newX += -1;
        break;
    }

    // console.log(`Moving to {${newX},${newY}}`);

    this.currentPoint = this.map.pointAt(newX, newY);
  }
}

export class PaintingManager {
  private robot: Robot;
  private state: ProgramState;
  private ioManager: InMemoryBufferIOManager;
  private processor: CodeProcessor;

  constructor(robot: Robot, state: ProgramState) {
    this.robot = robot;
    this.state = state;
    this.ioManager = new InMemoryBufferIOManager();
    this.processor = new CodeProcessor(this.ioManager);
  }

  private moveColorToInput() {
    if (this.robot.currentPoint.color === Color.black) {
      this.ioManager.addToInputBuffer(0);
    } else {
      this.ioManager.addToInputBuffer(1);
    }
  }

  private outputFromBuffer() : number {
    return this.ioManager.outputBuffer.shift();
  }

  private paint() {
    const colorOutput = this.outputFromBuffer();
    if (colorOutput === 0) {
      this.robot.currentPoint.paint(Color.black);
    } else {
      this.robot.currentPoint.paint(Color.white);
    }
  }

  private turnAndMove() {
    const directionOutput = this.outputFromBuffer();
    if (directionOutput === 0) {
      this.robot.rotateLeft();
    } else {
      this.robot.rotateRight();
    }
    this.robot.move();
  }

  private performStep() {
    this.moveColorToInput();
    this.processor.processCodes(this.state);
    this.paint();
    this.turnAndMove();
  }

  runUntilDone(maximumStepsAllows = Number.POSITIVE_INFINITY) {
    this.robot.currentPoint = this.robot.map.pointAt(0, 0);

    let counter = 0;
    while (this.state.haltReason !== HaltReason.terminated) {
      this.performStep();
      counter += 1;

      if (counter === maximumStepsAllows) {
        break;
      }
    }
  }
}

export class ProgramBuilder {
  static buildProgram() : ProgramState {
    const program = '3,8,1005,8,319,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,101,0,8,28,2,1105,12,10,1006,0,12,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,0,10,4,10,102,1,8,58,2,107,7,10,1006,0,38,2,1008,3,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,0,8,10,4,10,1001,8,0,90,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,101,0,8,112,1006,0,65,1,1103,1,10,1006,0,91,3,8,102,-1,8,10,101,1,10,10,4,10,108,1,8,10,4,10,101,0,8,144,1006,0,32,3,8,1002,8,-1,10,101,1,10,10,4,10,108,1,8,10,4,10,102,1,8,169,1,109,12,10,1006,0,96,1006,0,5,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,101,0,8,201,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,1001,8,0,223,1,4,9,10,2,8,5,10,1,3,4,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,1,8,10,4,10,101,0,8,257,1,1,9,10,1006,0,87,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,102,1,8,287,2,1105,20,10,1,1006,3,10,1,3,4,10,101,1,9,9,1007,9,1002,10,1005,10,15,99,109,641,104,0,104,1,21102,1,932972962600,1,21101,0,336,0,1106,0,440,21101,838483681940,0,1,21101,0,347,0,1106,0,440,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21101,3375393987,0,1,21101,394,0,0,1105,1,440,21102,46174071847,1,1,21102,1,405,0,1106,0,440,3,10,104,0,104,0,3,10,104,0,104,0,21101,988648461076,0,1,21101,428,0,0,1106,0,440,21101,0,709580452200,1,21101,439,0,0,1105,1,440,99,109,2,22101,0,-1,1,21101,40,0,2,21102,1,471,3,21102,461,1,0,1106,0,504,109,-2,2106,0,0,0,1,0,0,1,109,2,3,10,204,-1,1001,466,467,482,4,0,1001,466,1,466,108,4,466,10,1006,10,498,1102,0,1,466,109,-2,2105,1,0,0,109,4,1202,-1,1,503,1207,-3,0,10,1006,10,521,21102,1,0,-3,22102,1,-3,1,21201,-2,0,2,21101,0,1,3,21102,540,1,0,1106,0,545,109,-4,2106,0,0,109,5,1207,-3,1,10,1006,10,568,2207,-4,-2,10,1006,10,568,22101,0,-4,-4,1105,1,636,22102,1,-4,1,21201,-3,-1,2,21202,-2,2,3,21102,1,587,0,1105,1,545,22101,0,1,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,606,21101,0,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,628,21201,-1,0,1,21101,0,628,0,106,0,503,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2106,0,0';
    return ProgramState.fromString(program);
  }
}


export class FieldPainter {
  private pointToCharacter(point: Point, robot: Robot): string {
    if (point === undefined) {
      return ' ';
    }
    if (point === robot.currentPoint) {
      switch (robot.currentDirection) {
        case Direction.up:
          return '^';
        case Direction.right:
          return '>';
        case Direction.down:
          return 'V';
        case Direction.left:
          return '<';
      }
    } else if (point.color === Color.white) {
      return '#';
    } else {
      return ' ';
    }
  }

  renderLines(robot: Robot) : string[] {
    const paintedLines : string[] = [];

    const xValues = robot.map.points.map(p => p.x).sort((a,b) => a - b);
    const yValues = robot.map.points.map(p => p.y).sort((a,b) => a - b);

    const minX = xValues[0];
    const maxX = xValues.reverse()[0];

    const minY = yValues[0];
    const maxY = yValues.reverse()[0];

    const yShift = 0 - minY;

    for (let y = minY; y <= maxY; y += 1) {
      paintedLines[y + yShift] = '';
      for (let x = minX; x <= maxX; x += 1) {
        const point = robot.map.pointAt(x, y, false);
        const character = this.pointToCharacter(point, robot);
        paintedLines[y + yShift] += character;
      }
    }

    return paintedLines;
  }

  print(robot: Robot) {
    this.renderLines(robot).forEach((line) => {
      console.log(line);
    });
  }
}
