import { expect } from 'chai';
import 'mocha';

import { CodeProcessor } from './CodeProcessor';

describe('CodeProcessor', () => {
  let processor;

  beforeEach(() => {
    processor = new CodeProcessor();
  });

  describe('processCodes', () => {
    it('should handle empty array', () => {
      expect(processor.processCodes([])).to.eql([]);
    });

    it('should handle addition operation', () => {
      expect(processor.processCodes([1, 4, 5, 6, 7, 8, 0])).to.eql([1, 4, 5, 6, 7, 8, 15]);
    });

    it('should handle multiplication operation', () => {
      expect(processor.processCodes([2, 4, 5, 6, 7, 8, 0])).to.eql([2, 4, 5, 6, 7, 8, 56]);
    });

    it('should stop at halt operation', () => {
      expect(processor.processCodes([99, 2, 5, 6, 7, 8, 9, 0])).to.eql([99, 2, 5, 6, 7, 8, 9, 0]);
    });

    it('should handle example 1', () => {
      expect(processor.processCodes([1, 0, 0, 0, 99])).to.eql([2, 0, 0, 0, 99]);
    });

    it('should handle example 2', () => {
      expect(processor.processCodes([2, 3, 0, 3, 99])).to.eql([2, 3, 0, 6, 99]);
    });

    it('should handle example 3', () => {
      expect(processor.processCodes([2, 4, 4, 5, 99, 0])).to.eql([2, 4, 4, 5, 99, 9801]);
    });

    it('should handle example 4', () => {
      expect(processor.processCodes([1, 1, 1, 4, 99, 5, 6, 0, 99])).to.eql([30, 1, 1, 4, 2, 5, 6, 0, 99]);
    });

    it('should handle example 5', () => {
      expect(processor.processCodes([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])).to.eql([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    });
  });
});
