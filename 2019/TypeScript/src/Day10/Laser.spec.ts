import { expect } from 'chai';
import 'mocha';

import { FieldBuilder, Point } from './FieldBuilder';
import { LaserArray } from './Laser';

describe('LaserArray', () => {
  let builder : FieldBuilder;
  let laserArray : LaserArray;

  beforeEach(() => {
    builder = new FieldBuilder();
    laserArray = new LaserArray();
  });

  describe('destroyPointsInOrder', () => {
    it('should work for example', () => {
      const map = [
        '..#..',
        '#...#',
        '..#..',
        '..#..'
      ]
      const field = builder.build(map);
      const point = field.pointsInPosition[2][3];

      const destroyed = laserArray.destroyPointsInOrder(point, field);

      expect(destroyed.length).to.equal(4);
      expect(destroyed[0]).to.equal(field.pointsInPosition[2][2]);
      expect(destroyed[1]).to.equal(field.pointsInPosition[4][1]);
      expect(destroyed[2]).to.equal(field.pointsInPosition[0][1]);
      expect(destroyed[3]).to.equal(field.pointsInPosition[2][0]);
    });

    it('should work for bigger', () => {
      const map = [
        '.#....#####...#..',
        '##...##.#####..##',
        '##...#...#.#####.',
        '..#.....#...###..',
        '..#.#.....#....##',
      ];
      const field = builder.build(map);
      const point = field.pointsInPosition[8][3];

      const destroyed = laserArray.destroyPointsInOrder(point, field);

      expect(destroyed[0]).to.equal(field.pointsInPosition[8][1]);
      expect(destroyed[1]).to.equal(field.pointsInPosition[9][0]);
      expect(destroyed[2]).to.equal(field.pointsInPosition[9][1]);
      expect(destroyed[3]).to.equal(field.pointsInPosition[10][0]);
      expect(destroyed[4]).to.equal(field.pointsInPosition[9][2]);
      expect(destroyed[5]).to.equal(field.pointsInPosition[11][1]);
      expect(destroyed[6]).to.equal(field.pointsInPosition[12][1]);
      expect(destroyed[7]).to.equal(field.pointsInPosition[11][2]);
      expect(destroyed[8]).to.equal(field.pointsInPosition[15][1]);

      expect(destroyed[9]).to.equal(field.pointsInPosition[12][2]);
      expect(destroyed[10]).to.equal(field.pointsInPosition[13][2]);
      expect(destroyed[11]).to.equal(field.pointsInPosition[14][2]);
      expect(destroyed[12]).to.equal(field.pointsInPosition[15][2]);
      expect(destroyed[13]).to.equal(field.pointsInPosition[12][3]);
      expect(destroyed[14]).to.equal(field.pointsInPosition[16][4]);
      expect(destroyed[15]).to.equal(field.pointsInPosition[15][4]);
      expect(destroyed[16]).to.equal(field.pointsInPosition[10][4]);
      expect(destroyed[17]).to.equal(field.pointsInPosition[4][4]);
    });

    it('should work for much bigger', () => {
      const map = [
        '.#..##.###...#######',
        '##.############..##.',
        '.#.######.########.#',
        '.###.#######.####.#.',
        '#####.##.#.##.###.##',
        '..#####..#.#########',
        '####################',
        '#.####....###.#.#.##',
        '##.#################',
        '#####.##.###..####..',
        '..######..##.#######',
        '####.##.####...##..#',
        '.#####..#.######.###',
        '##...#.##########...',
        '#.##########.#######',
        '.####.#.###.###.#.##',
        '....##.##.###..#####',
        '.#.#.###########.###',
        '#.#.#.#####.####.###',
        '###.##.####.##.#..##',
      ]
      const field = builder.build(map);
      const point = field.pointsInPosition[11][13];

      const destroyed = laserArray.destroyPointsInOrder(point, field);

      expect(destroyed[0]).to.equal(field.pointsInPosition[11][12]);
      expect(destroyed[1]).to.equal(field.pointsInPosition[12][1]);
      expect(destroyed[2]).to.equal(field.pointsInPosition[12][2]);
      expect(destroyed[198]).to.equal(field.pointsInPosition[9][6]);
      expect(destroyed[199]).to.equal(field.pointsInPosition[8][2]);
      expect(destroyed[200]).to.equal(field.pointsInPosition[10][9]);
      expect(destroyed[298]).to.equal(field.pointsInPosition[11][1]);
    });
  });
});
