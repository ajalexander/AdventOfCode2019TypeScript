import { expect } from 'chai';
import 'mocha';

import { Color, Direction, Robot, FieldPainter } from './PaintingRobot';

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

describe('FieldPainter', () => {
  let robot: Robot;
  let painter: FieldPainter;

  beforeEach(() => {
    robot = new Robot();
    painter = new FieldPainter();
  });

  describe('renderLines', () => {
    it('should print robot facing up', () => {
      robot.currentDirection = Direction.up;
      const lines = painter.renderLines(robot);

      expect(lines).to.eql([
        '^'
      ]);
    });

    it('should print robot facing right', () => {
      robot.currentDirection = Direction.right;
      const lines = painter.renderLines(robot);

      expect(lines).to.eql([
        '>'
      ]);
    });

    it('should print robot facing down', () => {
      robot.currentDirection = Direction.down;
      const lines = painter.renderLines(robot);

      expect(lines).to.eql([
        'V'
      ]);
    });

    it('should print robot facing left', () => {
      robot.currentDirection = Direction.left;
      const lines = painter.renderLines(robot);

      expect(lines).to.eql([
        '<'
      ]);
    });

    it('should print white panels', () => {
      robot.map.pointAt(1, 0).color = Color.white;

      const lines = painter.renderLines(robot);

      expect(lines).to.eql([
        '^#'
      ]);
    });

    it('should print black panels', () => {
      robot.map.pointAt(1, 0).color = Color.black;

      const lines = painter.renderLines(robot);

      expect(lines).to.eql([
        '^ '
      ]);
    });

    it('should print missing panels as black', () => {
      robot.map.pointAt(2, 0).color = Color.black;

      const lines = painter.renderLines(robot);

      expect(lines).to.eql([
        '^  '
      ]);
    });

    it('should handle example', () => {
      robot.map.pointAt(-2, -1).color = Color.white;
      robot.map.pointAt(3, 2).color = Color.black;
      robot.currentPoint = robot.map.pointAt(0, 0);

      const lines = painter.renderLines(robot);

      expect(lines).to.eql([
        '#     ',
        '  ^   ',
        '      ',
        '      '
      ]);
    });
  });
});
