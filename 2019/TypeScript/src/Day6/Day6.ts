import { OrbitsBuilder, TransferStepsCalculator } from './OrbitsBuilder';
import Inputs from './Inputs';

const builder = new OrbitsBuilder();
const builtOrbits = builder.buildOrbits(Inputs);

console.log(`The COM node has ${builtOrbits.centerOfMass.countOrbits()} orbiting objects`);

const calculator = new TransferStepsCalculator();
const fromName = 'YOU';
const toName = 'SAN';
const transferStepsRequired = calculator.transfersRequiredBetweenNodes(builtOrbits, fromName, toName);
console.log(`There are ${transferStepsRequired} required transfers between ${fromName} and ${toName}`);
