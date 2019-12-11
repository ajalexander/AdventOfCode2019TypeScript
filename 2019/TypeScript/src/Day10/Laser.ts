import { Field, Point, PointsOnLine } from './FieldBuilder';

export class LaserArray {
  private pointsRemaining(pointsOnLine: PointsOnLine[]) {
    return pointsOnLine.some(item => item.points.length > 0);
  }

  private sweep(pointsOnLine: PointsOnLine[]) : Point[] {
    const destroyedInSweep = [];
    pointsOnLine.forEach((item) => {
      const point = item.points.shift();
      if (point) {
        destroyedInSweep.push(point);
      }
    })
    return destroyedInSweep;
  }

  destroyPointsInOrder(base: Point, field: Field) : Point[] {
    const destroyedPoints = [];
    const pointsByDegree = base.pointsByDegree(field.allPoints);

    while (this.pointsRemaining(pointsByDegree)) {
      destroyedPoints.push.apply(destroyedPoints, this.sweep(pointsByDegree));
    }

    return destroyedPoints;
  }
}