import { expect } from 'chai';
import 'mocha';

import { CodeProcessor, ProgramState } from './CodeProcessor';
import { InMemoryBufferIOManager } from './IOManager';

describe('CodeProcessor', () => {
  let processor;
  let ioManager : InMemoryBufferIOManager;

  beforeEach(() => {
    ioManager = new InMemoryBufferIOManager();
    processor = new CodeProcessor(ioManager);
  });

  describe('processCodes', () => {
    it('should handle empty array', () => {
      const state = processor.processCodes(new ProgramState([]));
      expect(state.opcodes).to.eql([]);
    });

    it('should handle addition operation', () => {
      const state = processor.processCodes(new ProgramState([1, 4, 5, 6, 7, 8, 0]));
      expect(state.opcodes).to.eql([1, 4, 5, 6, 7, 8, 15]);
    });

    it('should handle multiplication operation', () => {
      const state = processor.processCodes(new ProgramState([2, 4, 5, 6, 7, 8, 0]));
      expect(state.opcodes).to.eql([2, 4, 5, 6, 7, 8, 56]);
    });

    it('should handle input operation', () => {
      ioManager.addToInputBuffer(27);
      const state = processor.processCodes(new ProgramState([3, 1]));
      expect(state.opcodes).to.eql([3, 27]);
    });

    it('should handle output operation', () => {
      const state = processor.processCodes(new ProgramState([4, 2, 44]));
      expect(state.opcodes).to.eql([4, 2, 44]);
      expect(ioManager.outputBuffer).to.eql([44]);
    });

    it('should handle less than operation (true)', () => {
      const state = processor.processCodes(new ProgramState([7, 4, 5, 6, 17, 18, 0]));
      expect(state.opcodes).to.eql([7, 4, 5, 6, 17, 18, 1]);
    });

    it('should handle less than operation (false)', () => {
      const state = processor.processCodes(new ProgramState([7, 4, 5, 6, 17, 17, 0]));
      expect(state.opcodes).to.eql([7, 4, 5, 6, 17, 17, 0]);
    });

    it('should handle equals operation (true)', () => {
      const state = processor.processCodes(new ProgramState([8, 4, 5, 6, 17, 18, 0]));
      expect(state.opcodes).to.eql([8, 4, 5, 6, 17, 18, 0]);
    });

    it('should handle equals operation (false)', () => {
      const state = processor.processCodes(new ProgramState([8, 4, 5, 6, 17, 17, 0]));
      expect(state.opcodes).to.eql([8, 4, 5, 6, 17, 17, 1]);
    });

    it('should handle jump if true (true)', () => {
      const state = processor.processCodes(new ProgramState([1105, 1, 7, 0, 0, 1101, 30, 20, 0]));
      expect(state.opcodes).to.eql([1105, 1, 7, 0, 0, 1101, 30, 20, 0]);
    });

    it('should handle jump if true (false)', () => {
      const state = processor.processCodes(new ProgramState([105, 0, 6, 20, 0, 1101, 1, 2, 0]));
      expect(state.opcodes).to.eql([3, 0, 6, 20, 0, 1101, 1, 2, 0]);
    });

    it('should handle jump if false (true)', () => {
      const state = processor.processCodes(new ProgramState([1106, 0, 7, 0, 0, 1101, 30, 20, 0]));
      expect(state.opcodes).to.eql([1106, 0, 7, 0, 0, 1101, 30, 20, 0]);
    });

    it('should handle jump if false (false)', () => {
      const state = processor.processCodes(new ProgramState([106, -1, 6, 20, 0, 1101, 1, 2, 0]));
      expect(state.opcodes).to.eql([3, -1, 6, 20, 0, 1101, 1, 2, 0]);
    });

    it('should stop at halt operation', () => {
      const state = processor.processCodes(new ProgramState([99, 2, 5, 6, 7, 8, 9, 0]));
      expect(state.opcodes).to.eql([99, 2, 5, 6, 7, 8, 9, 0]);
    });

    it('should handle immediate mode for addition', () => {
      const state = processor.processCodes(new ProgramState([1101, 4, 5, 4, 0]));
      expect(state.opcodes).to.eql([1101, 4, 5, 4, 9]);
    });

    it('should handle immediate mode for multiplication', () => {
      const state = processor.processCodes(new ProgramState([1102, -2, 5, 4, 0]));
      expect(state.opcodes).to.eql([1102, -2, 5, 4, -10]);
    });

    it('should handle immediate mode output operation', () => {
      const state = processor.processCodes(new ProgramState([104, 2, 44]));
      expect(state.opcodes).to.eql([104, 2, 44]);
      expect(ioManager.outputBuffer).to.eql([2]);
    });

    it('should handle relative mode addition operation', () => {
      const state = new ProgramState([22201, 3, 3, -1, 45]);
      state.relativeBase = 1;
      processor.processCodes(state);
      expect(state.opcodes).to.eql([90, 3, 3, -1, 45]);
    });

    it('should handle relative mode multiply operation', () => {
      const state = new ProgramState([22202, 3, 4, -1, 31, 3]);
      state.relativeBase = 1;
      processor.processCodes(state);
      expect(state.opcodes).to.eql([93, 3, 4, -1, 31, 3]);
    });

    it('should handle relative mode input operation', () => {
      const state = new ProgramState([203, 2, 0]);
      state.relativeBase = 1;
      ioManager.addToInputBuffer(90);
      processor.processCodes(state);
      expect(state.opcodes).to.eql([203, 2, 0, 90]);
    });

    it('should handle relative mode output operation', () => {
      const state = new ProgramState([204, 2, 0, 90]);
      state.relativeBase = 1;
      processor.processCodes(state);
      expect(ioManager.outputBuffer).to.eql([90]);
    });

    it('should handle the relative base adjustment operation', () => {
      const state = new ProgramState([109,53]);
      state.relativeBase = -7;
      processor.processCodes(state);
      expect(state.relativeBase).to.eql(46);
    });

    it('should handle example 1', () => {
      const state = processor.processCodes(new ProgramState([1, 0, 0, 0, 99]));
      expect(state.opcodes).to.eql([2, 0, 0, 0, 99]);
    });

    it('should handle example 2', () => {
      const state = processor.processCodes(new ProgramState([2, 3, 0, 3, 99]));
      expect(state.opcodes).to.eql([2, 3, 0, 6, 99]);
    });

    it('should handle example 3', () => {
      const state = processor.processCodes(new ProgramState([2, 4, 4, 5, 99, 0]));
      expect(state.opcodes).to.eql([2, 4, 4, 5, 99, 9801]);
    });

    it('should handle example 4', () => {
      const state = processor.processCodes(new ProgramState([1, 1, 1, 4, 99, 5, 6, 0, 99]));
      expect(state.opcodes).to.eql([30, 1, 1, 4, 2, 5, 6, 0, 99]);
    });

    it('should handle example 5', () => {
      const state = processor.processCodes(new ProgramState([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]));
      expect(state.opcodes).to.eql([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    });

    it('should handle example 6', () => {
      const state = processor.processCodes(new ProgramState([1002, 4, 3, 4, 33]));
      expect(state.opcodes).to.eql([1002, 4, 3, 4, 99]);
    });

    describe('io examples', () => {
      describe('position mode', () => {
        it('equals mode (true)', () => {
          ioManager.addToInputBuffer(8);
          processor.processCodes(new ProgramState([3,9,8,9,10,9,4,9,99,-1,8]));
          expect(ioManager.outputBuffer).to.eql([1]);
        });
  
        it('equals mode (false)', () => {
          ioManager.addToInputBuffer(39);
          processor.processCodes(new ProgramState([3,9,8,9,10,9,4,9,99,-1,8]));
          expect(ioManager.outputBuffer).to.eql([0]);
        });

        it('less than mode (true)', () => {
          ioManager.addToInputBuffer(7);
          processor.processCodes(new ProgramState([3,9,7,9,10,9,4,9,99,-1,88]));
          expect(ioManager.outputBuffer).to.eql([1]);
        });
  
        it('less than mode (false)', () => {
          ioManager.addToInputBuffer(8);
          processor.processCodes(new ProgramState([3,9,7,9,10,9,4,9,99,-1,8]));
          expect(ioManager.outputBuffer).to.eql([0]);
        });

        it('jump mode (should output 0)', () => {
          ioManager.addToInputBuffer(0);
          processor.processCodes(new ProgramState([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]));
          expect(ioManager.outputBuffer).to.eql([0]);
        });

        it('jump mode (should output 1)', () => {
          ioManager.addToInputBuffer(1);
          processor.processCodes(new ProgramState([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]));
          expect(ioManager.outputBuffer).to.eql([1]);
        });
      });

      describe('immediate mode', () => {
        it('equals mode (true)', () => {
          ioManager.addToInputBuffer(8);
          processor.processCodes(new ProgramState([3,3,1108,-1,8,3,4,3,99]));
          expect(ioManager.outputBuffer).to.eql([1]);
        });
  
        it('equals mode (false)', () => {
          ioManager.addToInputBuffer(39);
          processor.processCodes(new ProgramState([3,3,1108,-1,8,3,4,3,99]));
          expect(ioManager.outputBuffer).to.eql([0]);
        });

        it('less than mode (true)', () => {
          ioManager.addToInputBuffer(7);
          processor.processCodes(new ProgramState([3,3,1107,-1,8,3,4,3,99]));
          expect(ioManager.outputBuffer).to.eql([1]);
        });
  
        it('less than mode (false)', () => {
          ioManager.addToInputBuffer(8);
          processor.processCodes(new ProgramState([3,3,1107,-1,8,3,4,3,99]));
          expect(ioManager.outputBuffer).to.eql([0]);
        });

        it('jump mode (should output 0)', () => {
          ioManager.addToInputBuffer(0);
          processor.processCodes(new ProgramState([3,3,1105,-1,9,1101,0,0,12,4,12,99,1]));
          expect(ioManager.outputBuffer).to.eql([0]);
        });

        it('jump mode (should output 1)', () => {
          ioManager.addToInputBuffer(1);
          processor.processCodes(new ProgramState([3,3,1105,-1,9,1101,0,0,12,4,12,99,1]));
          expect(ioManager.outputBuffer).to.eql([1]);
        });
      });

      describe('bigger example', () => {
        it('should output 999 when input < 8', () => {
          ioManager.addToInputBuffer(7);
          processor.processCodes(new ProgramState([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]));
          expect(ioManager.outputBuffer).to.eql([999]);
        });

        it('should output 1000 when input == 8', () => {
          ioManager.addToInputBuffer(8);
          processor.processCodes(new ProgramState([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]));
          expect(ioManager.outputBuffer).to.eql([1000]);
        });

        it('should output 1001 when input > 8', () => {
          ioManager.addToInputBuffer(9);
          processor.processCodes(new ProgramState([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]));
          expect(ioManager.outputBuffer).to.eql([1001]);
        });
      });

      describe('relative examples', () => {
        it('should handle example 1', () => {
          const state = new ProgramState([109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]);
          processor.processCodes(state);
          expect(ioManager.outputBuffer).to.eql([109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]);
        });

        it('should handle example 2', () => {
          const state = new ProgramState([1102,34915192,34915192,7,4,7,99,0]);
          processor.processCodes(state);
          expect(ioManager.outputBuffer).to.eql([1219070632396864]);
        });

        it('should handle example 3', () => {
          const state = new ProgramState([104,1125899906842624,99]);
          processor.processCodes(state);
          expect(ioManager.outputBuffer).to.eql([1125899906842624]);
        });

        it('should handle example 4', () => {
          const state = new ProgramState([109,1,203,11,209,8,204,1,99,10,0,42,0]);
          ioManager.addToInputBuffer(17);
          processor.processCodes(state);
          expect(ioManager.outputBuffer).to.eql([17]);
        });
      });
    });
  });
});
