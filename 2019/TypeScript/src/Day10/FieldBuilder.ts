export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  degreesTo(point: Point) : number {
    // Calculate degrees from left
    //        90
    //        |
    // 0 <---- ----> 180
    //        |
    //       -90
    const x = this.x - point.x;
    const y = this.y - point.y;

    const radians = Math.atan2(y, x);
    const degrees = radians * 180 / Math.PI;
    return degrees;
  }

  distanceBetween(other: Point) : number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }

  visiblePoints(points: Point[]) : Point[] {
    const visiblePoints = [];

    const otherPoints = points.filter(p => p !== this);
    const grouped = otherPoints.reduce((mapByDegree, otherPoint) => {
      const degrees = this.degreesTo(otherPoint);
      mapByDegree[degrees] = (mapByDegree[degrees] || [])
      mapByDegree[degrees].push(otherPoint);

      return mapByDegree;
    }, {})
    
    for (let degree in grouped) {
      const pointsOnLine : Point[] = grouped[degree];
      const sorted = pointsOnLine.sort((a, b) => this.distanceBetween(a) - this.distanceBetween(b));

      visiblePoints.push(sorted[0]);
    }

    return visiblePoints;
  }
}

export interface Field {
  pointsInPosition: Point[][];
  allPoints: Point[];
}

export interface BestMatch {
  point: Point;
  visiblePoints: number;
}

export class FieldBuilder {
  build(map: string[]) : Field {
    const points : Point[] = [];
    const positionedPoints : Point[][] = [];

    const addPointToPositioned = (point: Point) => {
      if (positionedPoints[point.x] === undefined) {
        positionedPoints[point.x] = [];
      }
      positionedPoints[point.x][point.y] = point;
    };

    map.forEach((line, lineIndex) => {
      line.split('').forEach((value, valueIndex) => {
        if (value === '#') {
          const point = new Point(valueIndex, lineIndex);
          points.push(point);
          addPointToPositioned(point);
        }
      });
    });

    return {
      pointsInPosition: positionedPoints,
      allPoints: points
    } as Field;
  }

  bestPosition(map: string[]) : BestMatch {
    const field = this.build(map);
    const sortedByVisibility = field.allPoints.sort((a, b) =>
      a.visiblePoints(field.allPoints).length -
      b.visiblePoints(field.allPoints).length);
    const best = sortedByVisibility.reverse()[0];
    const visibleFromBest = best.visiblePoints(field.allPoints);

    return {
      point: best,
      visiblePoints: visibleFromBest.length
    } as BestMatch;
  }
}