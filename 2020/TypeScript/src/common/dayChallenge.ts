import { FileReader } from './fileUtils';

export abstract class DayChallenge {
  run(): void {
    console.log(`Solution to Day ${this.dayNumber()}`);
    console.log('=== PART ONE ===');
    this.partOne();
    console.log('=== PART TWO ===');
    this.partTwo();
  }

  abstract dayNumber(): number;
  abstract partOne() : void;
  abstract partTwo() : void;
}

export abstract class FileInputChallenge extends DayChallenge {
  protected lines: string[];

  constructor(inputPath: string) {
    super();
    const reader = new FileReader();
    this.lines = reader.readFile(inputPath);
  }
}

export abstract class GroupedFileInputChallenge extends DayChallenge {
  protected groups: string[][];

  constructor(inputPath: string) {
    super();
    const reader = new FileReader();
    this.groups = reader.readFileIntoLineGroups(inputPath);
  }
}
