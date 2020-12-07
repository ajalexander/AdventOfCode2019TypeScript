import { DayChallenge } from '../common/dayChallenge';
import { FileReader } from '../common/fileUtils';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface Position {
  x: number;
  y: number;
}

class Map {
  private rows: string[][] = [];

  private isTreeInPosition(position: Position) {
    return this.rows[position.y][position.x] === '#';
  }

  private markTree(position: Position) {
    this.rows[position.y][position.x] = 'X';
  }

  private markOpen(position: Position) {
    this.rows[position.y][position.x] = 'O';
  }

  constructor(private mapPrototype: string[]) {
    this.rows = mapPrototype.map(row => row.split(''));
  }

  ensureWidth(desiredWidth: number) {
    if (this.rows[0].length < desiredWidth) {
      this.mapPrototype.map((row, index) => {
        row.split('').forEach(item => {
          this.rows[index].push(item);
        });
      })
    }
  }

  checkPositionForTree(position: Position) {
    if (this.isTreeInPosition(position)) {
      this.markTree(position);
      return true;
    }
    this.markOpen(position);
    return false;
  }

  width() {
    return this.rows[0].length;
  }

  height() {
    return this.rows.length;
  }

  print() {
    this.rows.forEach(row => {
      console.log(row.join(''));
    })
  }
}

export class Solution extends DayChallenge {
  private lines: string[];

  private atBottomOfRun(map: Map, position: Position) {
    return map.height() == (position.y + 1);
  }

  private treesEncountered(rightMovement: number, downMovement: number) {
    const map = new Map(this.lines.slice());
    const currentPosition = {
      x: 0,
      y: 0
    } as Position;
    let encounteredTrees = 0;
    // let stepCount = 0;

    while (!this.atBottomOfRun(map, currentPosition)) {
      map.ensureWidth(currentPosition.x + rightMovement + 1);
      currentPosition.x += rightMovement;
      currentPosition.y += downMovement;

      if (map.checkPositionForTree(currentPosition)) {
        encounteredTrees += 1;
      }

      // stepCount += 1;
      // console.log(`After step ${stepCount}`);
      // map.print();
      // console.log();
      // console.log();
    }

    // map.print();

    console.log(`When moving right ${rightMovement} and down ${downMovement}, ${encounteredTrees} trees will be encountered`);

    return encounteredTrees;
  }

  constructor() {
    super();
    const reader = new FileReader();
    this.lines = reader.readFile(inputPath);
  }

  dayNumber(): number {
    return 3;
  }

  partOne(): void {
    this.treesEncountered(3, 1);
  }

  partTwo(): void {
    const product = 1
      * this.treesEncountered(1, 1)
      * this.treesEncountered(3, 1)
      * this.treesEncountered(5, 1)
      * this.treesEncountered(7, 1)
      * this.treesEncountered(1, 2);
    
    console.log(`The product of all the trees encountered is ${product}`);
  }
}