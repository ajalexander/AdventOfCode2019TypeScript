import { DayChallenge } from '../common/dayChallenge';
import { problemInputs } from './data';

const input = problemInputs;

interface Position {
  x: number;
  y: number;
}

const rightMovement = 3;
const downMovement = 1;

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
  private atBottomOfRun(map: Map, position: Position) {
    return map.height() == (position.y + 1);
  }

  private treesEncountered() {
    const map = new Map(input.slice());
    const currentPosition = {
      x: 0,
      y: 0
    } as Position;
    let encounteredTrees = 0;
    let stepCount = 0;

    while (!this.atBottomOfRun(map, currentPosition)) {
      map.ensureWidth(currentPosition.x + rightMovement + 1);
      currentPosition.x += rightMovement;
      currentPosition.y += downMovement;

      if (map.checkPositionForTree(currentPosition)) {
        encounteredTrees += 1;
      }

      stepCount += 1;
      console.log(`After step ${stepCount}`);
      map.print();
      console.log();
      console.log();
    }

    map.print();

    return encounteredTrees;
  }

  dayNumber(): number {
    return 3;
  }

  partOne(): void {
    const encounteredTrees = this.treesEncountered();
    console.log(`Encountered ${encounteredTrees} trees along the way`)
  }

  partTwo(): void {

  }
}