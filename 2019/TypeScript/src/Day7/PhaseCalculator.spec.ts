import { expect } from 'chai';
import 'mocha';

import { PhaseCalculator } from './PhaseCalculator';

describe('PhaseCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new PhaseCalculator();
  });

  describe('calculate', () => {
    describe('integration test', () => {
      it('should work for example 1', () => {
        const phaseValues = [4,3,2,1,0];
        const codeString = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0';
        const result = calculator.calculate(codeString, phaseValues);
        expect(result).to.equal(43210);
      });

      it('should work for example 2', () => {
        const phaseValues = [0,1,2,3,4];
        const codeString = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
        const result = calculator.calculate(codeString, phaseValues);
        expect(result).to.equal(54321);
      });
    });
  });

  describe('findBestPhaseValues', () => {
    describe('integration test', () => {
      it('should work for example 1', () => {
        const codeString = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0';
        const result = calculator.findBestPhaseValues(codeString);
        expect(result.phaseSignals).to.eql([4,3,2,1,0]);
        expect(result.signal).to.equal(43210);
      });

      it('should work for example 2', () => {
        const codeString = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
        const result = calculator.findBestPhaseValues(codeString);
        expect(result.phaseSignals).to.eql([0,1,2,3,4]);
        expect(result.signal).to.equal(54321);
      });

      it('should work for example 3', () => {
        const codeString = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0';
        const result = calculator.findBestPhaseValues(codeString);
        expect(result.phaseSignals).to.eql([1,0,4,3,2]);
        expect(result.signal).to.equal(65210);
      });
    });
  });
});
