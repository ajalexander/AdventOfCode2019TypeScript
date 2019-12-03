import { expect } from 'chai';
import 'mocha';

import { PathTracer, Coordinate } from './PathTracer';

describe('PathTracer', () => {
  let tracer;

  beforeEach(() => {
    tracer = new PathTracer();
  });

  describe('tracePoints', () => {
    const checkForPoint = (points: Coordinate[], x: number, y: number) => {
      expect(points.some(p => p.x === x && p.y === y)).to.equal(true, `Expected to find x: ${x}, y: ${y}`);
    };

    it('should handle empty instructions', () => {
      expect(tracer.tracePoints('')).to.eql([]);
    });

    it('should handle up movements', () => {
      const points = tracer.tracePoints('U2');

      expect(points.length).to.equal(2);
      checkForPoint(points, 0, 1);
      checkForPoint(points, 0, 2);
    });

    it('should handle down movements', () => {
      const points = tracer.tracePoints('D2');

      expect(points.length).to.equal(2);
      checkForPoint(points, 0, -1);
      checkForPoint(points, 0, -2);
    });

    it('should handle left movements', () => {
      const points = tracer.tracePoints('L2');

      expect(points.length).to.equal(2);
      checkForPoint(points, -1, 0);
      checkForPoint(points, -2, 0);
    });

    it('should handle right movements', () => {
      const points = tracer.tracePoints('R2');

      expect(points.length).to.equal(2);
      checkForPoint(points, 1, 0);
      checkForPoint(points, 2, 0);
    });

    it('should handle multiple movements', () => {
      const points = tracer.tracePoints('R2,D1');

      expect(points.length).to.equal(3);
      checkForPoint(points, 1, 0);
      checkForPoint(points, 2, 0);
      checkForPoint(points, 2, -1);
    });
  });
});
