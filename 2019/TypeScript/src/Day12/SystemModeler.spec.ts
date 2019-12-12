import { expect } from 'chai';
import 'mocha';

import { Moon, Position, System, SystemModeler, Velocity } from './SystemModeler';

describe('Moon', () => {
  let moon: Moon;

  beforeEach(() => {
    moon = new Moon(new Position(5, 5, 5));
  });

  describe('move', () => {
    it('should adjust by velocity values', () => {
      moon.velocity = new Velocity(1, -1, 2);

      moon.move();

      expect(moon.position.x).to.equal(6);
      expect(moon.position.y).to.equal(4);
      expect(moon.position.z).to.equal(7);
    });
  });

  describe('potentialEnergy', () => {
    it('should handle positive values', () => {
      moon.position = new Position(1, 2, 3);

      expect(moon.potentialEnergy()).to.equal(6);
    });

    it('should handle negative values', () => {
      moon.position = new Position(-2, -3, -5);

      expect(moon.potentialEnergy()).to.equal(10);
    });
  });

  describe('kineticEnergy', () => {
    it('should handle positive values', () => {
      moon.velocity = new Velocity(1, 2, 3);

      expect(moon.kineticEnergy()).to.equal(6);
    });

    it('should handle negative values', () => {
      moon.velocity = new Velocity(-2, -3, -5);

      expect(moon.kineticEnergy()).to.equal(10);
    });
  });

  describe('totalEnergy', () => {
    it('should return product of potential and kinetic', () => {
      moon.position = new Velocity(1, 2, 3);
      moon.velocity = new Velocity(-2, -3, -5);

      expect(moon.totalEnergy()).to.equal(60);
    });
  });
});

describe('System', () => {
  let system: System;

  beforeEach(() => {
    system = new System();
  });

  describe('uniquePairs', () => {
    it('should build pairs', () => {
      system.moons.push(new Moon(new Position(1, 0, 0)));
      system.moons.push(new Moon(new Position(0, 1, 0)));
      system.moons.push(new Moon(new Position(0, 0, 1)));

      const pairs = system.uniquePairs();

      expect(pairs.length).to.equal(3);
      expect(pairs.some(p => p.includes(system.moons[0]) && p.includes(system.moons[1]))).to.equal(true);
      expect(pairs.some(p => p.includes(system.moons[0]) && p.includes(system.moons[2]))).to.equal(true);
      expect(pairs.some(p => p.includes(system.moons[1]) && p.includes(system.moons[2]))).to.equal(true);
    });
  });
});

describe('System', () => {
  let system: System;
  let modeler: SystemModeler;

  beforeEach(() => {
    system = new System();
    modeler = new SystemModeler(system);
  });

  describe('adjustVelocities', () => {
    it('should handle example 1', () => {
      system.moons.push(new Moon(new Position(-1, 0, 2)));
      system.moons.push(new Moon(new Position(2, -10, -7)));
      system.moons.push(new Moon(new Position(4, -8, 8)));
      system.moons.push(new Moon(new Position(3, 5, -1)));

      modeler.adjustVelocities();

      expect(system.moons[0].velocity.x).to.equal(3);
      expect(system.moons[0].velocity.y).to.equal(-1);
      expect(system.moons[0].velocity.z).to.equal(-1);

      expect(system.moons[1].velocity.x).to.equal(1);
      expect(system.moons[1].velocity.y).to.equal(3);
      expect(system.moons[1].velocity.z).to.equal(3);

      expect(system.moons[2].velocity.x).to.equal(-3);
      expect(system.moons[2].velocity.y).to.equal(1);
      expect(system.moons[2].velocity.z).to.equal(-3);

      expect(system.moons[3].velocity.x).to.equal(-1);
      expect(system.moons[3].velocity.y).to.equal(-3);
      expect(system.moons[3].velocity.z).to.equal(1);
    });
  });

  describe('move', () => {
    it('should adjust positions by velocity', () => {
      system.moons.push(new Moon(new Position(-1, 0, 2), new Velocity()));
      system.moons.push(new Moon(new Position(2, -10, -7), new Velocity(2, -5, 3)));

      modeler.move();

      expect(system.moons[0].position.x).to.equal(-1);
      expect(system.moons[0].position.y).to.equal(0);
      expect(system.moons[0].position.z).to.equal(2);

      expect(system.moons[1].position.x).to.equal(4);
      expect(system.moons[1].position.y).to.equal(-15);
      expect(system.moons[1].position.z).to.equal(-4);
    });
  });

  describe('adjustAndMove', () => {
    it('should work for example 10 moves', () => {
      system.moons.push(new Moon(new Position(-1, 0, 2)));
      system.moons.push(new Moon(new Position(2, -10, -7)));
      system.moons.push(new Moon(new Position(4, -8, 8)));
      system.moons.push(new Moon(new Position(3, 5, -1)));

      modeler.adjustAndMove(10);

      expect(system.moons[0].position.x).to.equal(2);
      expect(system.moons[0].position.y).to.equal(1);
      expect(system.moons[0].position.z).to.equal(-3);

      expect(system.moons[1].position.x).to.equal(1);
      expect(system.moons[1].position.y).to.equal(-8);
      expect(system.moons[1].position.z).to.equal(0);

      expect(system.moons[2].position.x).to.equal(3);
      expect(system.moons[2].position.y).to.equal(-6);
      expect(system.moons[2].position.z).to.equal(1);

      expect(system.moons[3].position.x).to.equal(2);
      expect(system.moons[3].position.y).to.equal(0);
      expect(system.moons[3].position.z).to.equal(4);

      // Not technically related to adjustAndMove but a convenient place to test
      expect(system.totalEnergy()).to.equal(179);
    });
  });
});
