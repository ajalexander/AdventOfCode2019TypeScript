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
