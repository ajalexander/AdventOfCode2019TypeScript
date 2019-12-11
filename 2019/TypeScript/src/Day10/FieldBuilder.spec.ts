import { expect } from 'chai';
import 'mocha';

import { FieldBuilder, Point } from './FieldBuilder';

describe('Point', () => {
  describe('constructor', () => {
    it('should set x and y', () => {
      const point = new Point(2, 3);
      expect(point.x).to.equal(2);
      expect(point.y).to.equal(3);
    });
  });

  describe('degreesTo', () => {
    it('should handle straight up', () => {
      const point = new Point(2, 2);
      const otherPoint = new Point(2, 1);

      expect(point.degreesTo(otherPoint)).to.equal(0);
    });

    it('should handle straight down', () => {
      const point = new Point(2, 2);
      const otherPoint = new Point(2, 3);

      expect(point.degreesTo(otherPoint)).to.equal(180);
    });

    it('should handle straight left', () => {
      const point = new Point(2, 2);
      const otherPoint = new Point(1, 2);

      expect(point.degreesTo(otherPoint)).to.equal(270);
    });

    it('should handle straight right', () => {
      const point = new Point(2, 2);
      const otherPoint = new Point(3, 2);

      expect(point.degreesTo(otherPoint)).to.equal(90);
    });

    it('should handle angled distance', () => {
      const point = new Point(2, 2);
      const otherPointNE = new Point(3, 1);
      const otherPointSE = new Point(3, 3);
      const otherPointSW = new Point(1, 3);
      const otherPointNW = new Point(1, 1);

      expect(point.degreesTo(otherPointNE)).to.be.closeTo(45, 0.0001);
      expect(point.degreesTo(otherPointSE)).to.be.closeTo(135, 0.0001);
      expect(point.degreesTo(otherPointSW)).to.be.closeTo(225, 0.0001);
      expect(point.degreesTo(otherPointNW)).to.be.closeTo(315, 0.0001);
    });

    it('should handle angled distance in line', () => {
      const point = new Point(2, 2);
      const otherPoint1 = new Point(3, 3);
      const otherPoint2 = new Point(4, 4);

      expect(point.degreesTo(otherPoint1)).to.be.closeTo(135, 0.0001);
      expect(point.degreesTo(otherPoint2)).to.be.closeTo(135, 0.0001);
    });
  });

  describe('distanceBetween', () => {
    it('should handle straight distance', () => {
      const point = new Point(2, 2);
      const otherPoint = new Point(2, 10);

      expect(point.distanceBetween(otherPoint)).to.equal(8);
    });

    it('should handle angled distance', () => {
      const point = new Point(2, 2);
      const otherPoint = new Point(3, 8);

      expect(point.distanceBetween(otherPoint)).to.be.closeTo(6.0828, 0.0001);
    });
  });

  describe('visible points', () => {
    it('should include other points', () => {
      const point = new Point(2, 2);
      const points = [
        point,
        new Point(1, 1),
        new Point(0, 7)
      ];

      const visiblePoints = point.visiblePoints(points);
      
      expect(visiblePoints.length).to.equal(2);
      expect(visiblePoints).to.contain(points[1]);
      expect(visiblePoints).to.contain(points[2]);
    });

    it('should only have nearest point on same line', () => {
      const point = new Point(2, 2);
      const points = [
        point,
        new Point(1, 1),
        new Point(0, 0)
      ];

      const visiblePoints = point.visiblePoints(points);
      
      expect(visiblePoints.length).to.equal(1);
      expect(visiblePoints).to.contain(points[1]);
    });
  });
});

describe('FieldBuilder', () => {
  let builder: FieldBuilder;

  beforeEach(() => {
    builder = new FieldBuilder();
  });

  describe('build', () => {
    it('should parse map', () => {
      const map = [
        '#...#',
        '..###'
      ];

      const field = builder.build(map);

      expect(field.allPoints.length).to.equal(5);

      expect(field.allPoints.some(p => p.x === 0 && p.y === 0)).to.equal(true);
      expect(field.allPoints.some(p => p.x === 4 && p.y === 0)).to.equal(true);
      expect(field.allPoints.some(p => p.x === 2 && p.y === 1)).to.equal(true);
      expect(field.allPoints.some(p => p.x === 3 && p.y === 1)).to.equal(true);
      expect(field.allPoints.some(p => p.x === 4 && p.y === 1)).to.equal(true);
    });
  });

  describe('bestPosition', () => {
    it('should work for example 1', () => {
      const map = [
        '.#..#',
        '.....',
        '#####',
        '....#',
        '...##',
      ];
      const field = builder.build(map);
      const result = builder.bestPosition(field);

      expect(result.point.x).to.equal(3);
      expect(result.point.y).to.equal(4);

      expect(result.visiblePoints).to.equal(8);
    });

    it('should work for example 2', () => {
      const map = [
        '......#.#.',
        '#..#.#....',
        '..#######.',
        '.#.#.###..',
        '.#..#.....',
        '..#....#.#',
        '#..#....#.',
        '.##.#..###',
        '##...#..#.',
        '.#....####',
      ];
      const field = builder.build(map);
      const result = builder.bestPosition(field);

      expect(result.point.x).to.equal(5);
      expect(result.point.y).to.equal(8);

      expect(result.visiblePoints).to.equal(33);
    });
  });
});
