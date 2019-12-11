import { FieldBuilder } from './FieldBuilder';
import { LaserArray } from './Laser';

const map = [
  '.###..#######..####..##...#',
  '########.#.###...###.#....#',
  '###..#...#######...#..####.',
  '.##.#.....#....##.#.#.....#',
  '###.#######.###..##......#.',
  '#..###..###.##.#.#####....#',
  '#.##..###....#####...##.##.',
  '####.##..#...#####.#..###.#',
  '#..#....####.####.###.#.###',
  '#..#..#....###...#####..#..',
  '##...####.######....#.####.',
  '####.##...###.####..##....#',
  '#.#..#.###.#.##.####..#...#',
  '..##..##....#.#..##..#.#..#',
  '##.##.#..######.#..#..####.',
  '#.....#####.##........#####',
  '###.#.#######..#.#.##..#..#',
  '###...#..#.#..##.##..#####.',
  '.##.#..#...#####.###.##.##.',
  '...#.#.######.#####.#.####.',
  '#..##..###...###.#.#..#.#.#',
  '.#..#.#......#.###...###..#',
  '#.##.#.#..#.#......#..#..##',
  '.##.##.##.#...##.##.##.#..#',
  '#.###.#.#...##..#####.###.#',
  '#.####.#..#.#.##.######.#..',
  '.#.#####.##...#...#.##...#.',
];

const builder = new FieldBuilder();
const field = builder.build(map);
const bestPosition = builder.bestPosition(field);

console.log(`Best position is at {${bestPosition.point.x},${bestPosition.point.y}} with ${bestPosition.visiblePoints} visible`);

const layerArray = new LaserArray();
const destroyedPoints = layerArray.destroyPointsInOrder(bestPosition.point, field);
const targetPoint = destroyedPoints[199];

console.log(`The 200th destoyed point is {${targetPoint.x}.${targetPoint.y}}`);
