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

      it('should work for feedback 1', () => {
        const phaseValues = [9,8,7,6,5];
        const codeString = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';
        const result = calculator.calculate(codeString, phaseValues, true);
        expect(result).to.equal(139629729);
      });

      it('should work for feedback 2', () => {
        const phaseValues = [9,7,8,5,6];
        const codeString = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10';
        const result = calculator.calculate(codeString, phaseValues, true);
        expect(result).to.equal(18216);
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

  describe('findBestPhaseValuesForFeedback', () => {
    describe('integration test', () => {
      it('should work for example 1', () => {
        const codeString = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';
        const result = calculator.findBestPhaseValuesForFeedback(codeString);
        expect(result.phaseSignals).to.eql([9,8,7,6,5]);
        expect(result.signal).to.equal(139629729);
      });

      it('should work for example 2', () => {
        const codeString = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10';
        const result = calculator.findBestPhaseValuesForFeedback(codeString);
        expect(result.phaseSignals).to.eql([9,7,8,5,6]);
        expect(result.signal).to.equal(18216);
      });
    });
  });
});
