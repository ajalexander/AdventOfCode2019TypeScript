import { MapBuilder, Simulator } from './Modeler'

const input = [
  '#..#.',
  '..#..',
  '...##',
  '...#.',
  '#.###',
];

const builder = new MapBuilder();
const map = builder.build(input);

const simulator = new Simulator(map);
simulator.findMatchingState();

console.log(`The first matching state has a biodiversity score of ${map.biodiversityScore()}`);
