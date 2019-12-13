import { Moon, Position, System, SystemModeler } from './SystemModeler';

let system = new System();
system.moons.push(new Moon(new Position(15, -2, -6)));
system.moons.push(new Moon(new Position(-5, -4, -11)));
system.moons.push(new Moon(new Position(0, -6, 0)));
system.moons.push(new Moon(new Position(5, 9, 6)));

let modeler = new SystemModeler(system);
modeler.adjustAndMove(1000);

console.log(`Total energy in the system is ${system.totalEnergy()} after 1000 movements`);

system = new System();
system.moons.push(new Moon(new Position(-8, -10, 0)));
system.moons.push(new Moon(new Position(5, 5, 10)));
system.moons.push(new Moon(new Position(2, -7, 3)));
system.moons.push(new Moon(new Position(9, -8, -3)));

modeler = new SystemModeler(system);
const steps = modeler.waitUntilAlignment();

console.log(`${steps} necessary to get back to a matching state`);
