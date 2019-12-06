import { OrbitNode, OrbitsBuilder } from './OrbitsBuilder';
import Inputs from './Inputs';

const builder = new OrbitsBuilder();
const centerNode = builder.buildOrbits(Inputs);

console.log(`The COM node has ${centerNode.countOrbits()} orbiting objects`);
