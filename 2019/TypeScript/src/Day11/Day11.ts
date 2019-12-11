import { PaintingManager, ProgramBuilder, Robot } from './PaintingRobot';

const state = ProgramBuilder.buildProgram();
const robot = new Robot();

const manager = new PaintingManager(robot, state);
manager.runUntilDone();

console.log(`There were ${robot.map.paintedPoints().length} painted tiles`);

