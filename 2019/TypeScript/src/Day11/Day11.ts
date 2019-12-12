import { Color, FieldPainter, PaintingManager, ProgramBuilder, Robot } from './PaintingRobot';

let state = ProgramBuilder.buildProgram();
let robot = new Robot();

let manager = new PaintingManager(robot, state);
manager.runUntilDone();

console.log(`There were ${robot.map.paintedPoints().length} painted tiles when started on black`);



state = ProgramBuilder.buildProgram();
robot = new Robot();
robot.currentPoint.color = Color.white;

manager = new PaintingManager(robot, state);
manager.runUntilDone();

console.log(`There were ${robot.map.paintedPoints().length} painted tiles when started on black`);

const painter = new FieldPainter();
painter.print(robot);
