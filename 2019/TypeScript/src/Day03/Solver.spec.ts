import { expect } from 'chai';
import 'mocha';

import { Coordinate } from './PathTracer';
import { Solver } from './Solver';

describe('Solver', () => {
  let solver;

  beforeEach(() => {
    solver = new Solver();
  });

  describe('findDistance', () => {
    it('should handle example 0', () => {
      const path1 = 'R8,U5,L5,D3';
      const path2 = 'U7,R6,D4,L4';
      expect(solver.findDistance(path1, path2)).to.equal(6);
    });

    it('should handle example 1', () => {
      const path1 = 'R75,D30,R83,U83,L12,D49,R71,U7,L72';
      const path2 = 'U62,R66,U55,R34,D71,R55,D58,R83';
      expect(solver.findDistance(path1, path2)).to.equal(159);
    });

    it('should handle example 2', () => {
      const path1 = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51';
      const path2 = 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7';
      expect(solver.findDistance(path1, path2)).to.equal(135);
    });
  });

  describe('findFewestSteps', () => {
    it('should handle example 0', () => {
      const path1 = 'R8,U5,L5,D3';
      const path2 = 'U7,R6,D4,L4';
      expect(solver.findFewestSteps(path1, path2)).to.equal(30);
    });

    it('should handle example 1', () => {
      const path1 = 'R75,D30,R83,U83,L12,D49,R71,U7,L72';
      const path2 = 'U62,R66,U55,R34,D71,R55,D58,R83';
      expect(solver.findFewestSteps(path1, path2)).to.equal(610);
    });

    it('should handle example 2', () => {
      const path1 = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51';
      const path2 = 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7';
      expect(solver.findFewestSteps(path1, path2)).to.equal(410);
    });
  });
});
