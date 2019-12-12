export class Position {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
export class Velocity {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  shift(shift: Velocity) {
    this.x += shift.x;
    this.y += shift.y;
    this.z += shift.z;
  }
}

export class Moon {
  position: Position;
  velocity: Velocity;

  constructor(initialPosition: Position, initialVelocity = new Velocity(0, 0, 0)) {
    this.position = initialPosition;
    this.velocity = initialVelocity;
  }

  move() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
  }

  potentialEnergy() : number {
    return Math.abs(this.position.x) + Math.abs(this.position.y) + Math.abs(this.position.z);
  }

  kineticEnergy() : number {
    return Math.abs(this.velocity.x) + Math.abs(this.velocity.y) + Math.abs(this.velocity.z);
  }

  totalEnergy() : number {
    return this.potentialEnergy() * this.kineticEnergy();
  }
}

export class System {
  moons: Moon[];

  constructor() {
    this.moons = [];
  }

  uniquePairs() : Moon[][] {
    const pairs = [];
    for (let index = 0; index < this.moons.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < this.moons.length; otherIndex += 1) {
        pairs.push([this.moons[index], this.moons[otherIndex]]);
      }
    }
    return pairs;
  }

  totalEnergy() : number {
    return this.moons.reduce((acc, moon) => {
      acc += moon.totalEnergy();
      return acc;
    }, 0);
  }
}

export class SystemModeler {
  system: System;

  constructor(system: System) {
    this.system = system;
  }

  private getShift(left: number, right: number) {
    if (left < right) {
      return 1;
    } else if (left > right) {
      return -1;
    }
    return 0;
  }

  adjustVelocities() {
    const velocityShifts = this.system.moons.reduce((map, moon) => {
      map.set(moon, new Velocity());
      return map;
    }, new Map<Moon, Velocity>());

    this.system.uniquePairs().forEach((pair) => {
      const [left, right] = pair;
      
      const leftShiftX = this.getShift(left.position.x, right.position.x);
      const leftShiftY = this.getShift(left.position.y, right.position.y);
      const leftShiftZ = this.getShift(left.position.z, right.position.z);

      velocityShifts.get(left).x += leftShiftX;
      velocityShifts.get(left).y += leftShiftY;
      velocityShifts.get(left).z += leftShiftZ;

      velocityShifts.get(right).x += leftShiftX * -1;
      velocityShifts.get(right).y += leftShiftY * -1;
      velocityShifts.get(right).z += leftShiftZ * -1;
    });

    velocityShifts.forEach((shift, moon) => {
      moon.velocity.shift(shift);
    });
  }

  move() {
    this.system.moons.forEach((moon) => {
      moon.move();
    });
  }

  adjustAndMove(timesToRun : number = 1) {
    for (let counter = 0; counter < timesToRun; counter += 1) {
      this.adjustVelocities();
      this.move();
    }
  }
}
