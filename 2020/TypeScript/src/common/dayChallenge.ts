import { FileReader } from './fileUtils';

export abstract class DayChallenge {
  private runPart(name: string, targetFunction: () => void) {
    console.log(`=== PART ${name} ===`);
    console.log();

    const start = new Date().getTime();
    targetFunction();
    const end = new Date().getTime();

    console.log();
    console.log(`[Elapsed Time: ${end - start} ms]`);

    console.log();
    console.log();
  }

  run(): void {
    console.log(`=== Solution to Day ${this.dayNumber()} ===`);
    console.log();

    this.runPart('ONE', () => this.partOne());
    this.runPart('TWO', () => this.partTwo());
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
