import { expect } from 'chai';
import 'mocha';

import { Direction, Map, Robot, PaintingManager, ProgramBuilder } from './PaintingRobot';
import { ProgramState } from './CodeProcessor';

describe('Robot', () => {
  let robot: Robot;

  beforeEach(() => {
    robot = new Robot();
  });

  describe('constructor', () => {
    it('should setup the initial state', () => {
      expect(robot.map).not.to.equal(undefined);
      expect(robot.currentPoint).to.equal(robot.map.pointAt(0, 0));
      expect(robot.currentDirection).to.equal(Direction.up);
    });
  });

  describe('move', () => {
    it('should move up', () => {
      robot.currentPoint = robot.map.pointAt(1, 1);
      robot.currentDirection = Direction.up;

      robot.move();

      expect(robot.currentPoint).to.equal(robot.map.pointAt(1, 0));
    });

    it('should move right', () => {
      robot.currentPoint = robot.map.pointAt(1, 1);
      robot.currentDirection = Direction.right;

      robot.move();

      expect(robot.currentPoint).to.equal(robot.map.pointAt(2, 1));
    });

    it('should move down', () => {
      robot.currentPoint = robot.map.pointAt(1, 1);
      robot.currentDirection = Direction.down;

      robot.move();

      expect(robot.currentPoint).to.equal(robot.map.pointAt(1, 2));
    });

    it('should move left', () => {
      robot.currentPoint = robot.map.pointAt(1, 1);
      robot.currentDirection = Direction.left;

      robot.move();

      expect(robot.currentPoint).to.equal(robot.map.pointAt(0, 1));
    });
  });
});
