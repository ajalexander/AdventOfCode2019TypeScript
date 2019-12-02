export class FuelCalculator {
  fuelForMass(weight: number) : number {
    const baseFuel = Math.floor(weight / 3) - 2;
    return baseFuel > 0 ? baseFuel : 0;
  }

  fuelForModule(weight: number) : number {
    let fuel = this.fuelForMass(weight);
    let runningTotal = fuel;
    while (fuel > 0) {
      fuel = this.fuelForMass(fuel);
      runningTotal += fuel;
    }
    return runningTotal;
  }

  fuelForSpacecraft(moduleWeights: number[]) : number {
    return moduleWeights
      .map(weight => this.fuelForModule(weight))
      .reduce((a, b) => a + b, 0);
  }
}
