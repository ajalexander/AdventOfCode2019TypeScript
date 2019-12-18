import { CodeProcessor, ProgramState } from '../Common/CodeProcessor';
import { InMemoryBufferIOManager } from '../Common/IOManager';

export class Printer {
  ioManager: InMemoryBufferIOManager;
  processor: CodeProcessor;
  
  constructor() {
    this.ioManager = new InMemoryBufferIOManager();
    this.processor = new CodeProcessor(this.ioManager);
  }

  print(state: ProgramState) : string[] {
    this.processor.processCodes(state);
    return this.ioManager.outputBuffer.map(i => String.fromCharCode(i)).join('').split(String.fromCharCode(10));
  }

  printToScreen(state: ProgramState) {
    console.log(this.print(state).join(String.fromCharCode(10)));
  }
}

export class Intersection {
  x: number;
  y: number;
  alignmentValue: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.alignmentValue = x * y;
  }
}

export class IntersectionFinder {
  private hasScaffoldAbove(lines: string[], lineIndex: number, columnIndex: number) {
    if (lineIndex > 0 && lines[lineIndex - 1][columnIndex] === '#') {
      return true;
    }
    return false;
  }

  private hasScaffoldBelow(lines: string[], lineIndex: number, columnIndex: number) {
    if (lineIndex < lines.length - 1 && lines[lineIndex + 1][columnIndex] === '#') {
      return true;
    }
    return false;
  }

  private hasScaffoldLeft(lines: string[], lineIndex: number, columnIndex: number) {
    if (columnIndex > 0 && lines[lineIndex][columnIndex - 1] === '#') {
      return true;
    }
    return false;
  }

  private hasScaffoldRight(lines: string[], lineIndex: number, columnIndex: number) {
    if (columnIndex < lines[lineIndex].length - 1 && lines[lineIndex][columnIndex + 1] === '#') {
      return true;
    }
    return false;
  }

  private isIntersection(lines: string[], lineIndex: number, columnIndex: number) {
    return this.hasScaffoldAbove(lines, lineIndex, columnIndex)
      && this.hasScaffoldBelow(lines, lineIndex, columnIndex)
      && this.hasScaffoldLeft(lines, lineIndex, columnIndex)
      && this.hasScaffoldRight(lines, lineIndex, columnIndex);
  }

  findIntersections(lines : string[]) {
    const intersections : Intersection[] = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      for (let columnIndex = 0; columnIndex < lines[lineIndex].length; columnIndex += 1) {
        if (lines[lineIndex][columnIndex] === '#') {
          if (this.isIntersection(lines, lineIndex, columnIndex)) {
            intersections.push(new Intersection(columnIndex, lineIndex));
          }
        }
      }
    }

    return intersections;
  }
}
