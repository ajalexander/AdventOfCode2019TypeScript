import { expect } from 'chai';
import 'mocha';

import { FuelCalculator } from './FuelCalculator';

describe('FuelCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new FuelCalculator();
  });

  describe('fuelForMass', () => {
    it('should be 2 when mass is 12', () => {
      expect(calculator.fuelForMass(12)).to.equal(2);
    });

    it('should be 2 when module mass is 14', () => {
      expect(calculator.fuelForMass(14)).to.equal(2);
    });

    it('should be 654 when module mass is 1969', () => {
      expect(calculator.fuelForMass(1969)).to.equal(654);
    });

    it('should be 33583 when module mass is 100756', () => {
      expect(calculator.fuelForMass(100756)).to.equal(33583);
    });
  });

  describe('fuelForModule', () => {
    it('should be 2 when mass is 12', () => {
      expect(calculator.fuelForModule(12)).to.equal(2);
    });

    it('should be 966 when module mass is 1969', () => {
      expect(calculator.fuelForModule(1969)).to.equal(966);
    });

    it('should be 654 when module mass is 100756', () => {
      expect(calculator.fuelForModule(100756)).to.equal(50346);
    });
  });

  describe('fuelForSpacecraft', () => {
    it('should be 0 when no modules', () => {
      expect(calculator.fuelForSpacecraft([])).to.equal(0);
    });

    it('should calculate single module', () => {
      expect(calculator.fuelForSpacecraft([12])).to.equal(2);
    });

    it('should calculate multiple modules', () => {
      expect(calculator.fuelForSpacecraft([12, 1969])).to.equal(968);
    });
  })
});
