import { expect } from 'chai';
import 'mocha';

import { IntersectionFinder } from './IntersectionFinder';
import { Coordinate } from './PathTracer';

describe('IntersectionFinder', () => {
  let finder;

  beforeEach(() => {
    finder = new IntersectionFinder();
  });

  describe('findIntersections', () => {
    const checkForPoint = (points: Coordinate[], x: number, y: number) => {
      expect(points.some(p => p.x === x && p.y === y)).to.equal(true, `Expected to find x: ${x}, y: ${y}`);
    };

    it('should handle empty paths', () => {
      expect(finder.findIntersections([], [])).to.eql([]);
    });

    it('should handle non-intersecting paths', () => {
      const path1 = [new Coordinate(1, 1)];
      const path2 = [new Coordinate(-1, -1)];
      expect(finder.findIntersections(path1, path2)).to.eql([]);
    });

    it('should handle find intersections', () => {
      const path1 = [new Coordinate(1, 1), new Coordinate(-1, -2)];
      const path2 = [new Coordinate(-1, -2)];

      const points = finder.findIntersections(path1, path2);

      expect(points.length).to.equal(1);
      checkForPoint(points, -1, -2);
    });
  });

  describe('sortByDistanceFromOrigin', () => {
    it('should sort by distance', () => {
      const points = [
        new Coordinate(1, 1),
        new Coordinate(10, 9),
        new Coordinate(-2, 5)
      ];

      const sorted = finder.sortByDistanceFromOrigin(points);
      expect(sorted[0]).to.equal(points[0]);
      expect(sorted[1]).to.equal(points[1]);
      expect(sorted[2]).to.equal(points[2]);
    });
  });

  describe('findDistanceOfNearestToOrigin', () => {

    it('should find distance', () => {
      const points = [
        new Coordinate(1, 1),
        new Coordinate(10, 9),
        new Coordinate(-2, 5)
      ];
        
      const distance = finder.findDistanceOfNearestToOrigin(points);
      expect(distance).to.equal(2);
    });
  });
});
