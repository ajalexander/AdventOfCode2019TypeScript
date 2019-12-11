export interface PointsOnLine {
  degree: number;
  points: Point[];
}

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  degreesTo(point: Point) : number {
    // Calculate degrees from top counting clockwise
    //         0
    //         |
    // 270 <---- ----> 90
    //         |
    //        180
    const x = this.x - point.x;
    const y = this.y - point.y;

    const radians = Math.atan2(y, x);
    const baseDegrees = radians * 180 / Math.PI;

    let rotatedDegrees = baseDegrees - 90;
    if (rotatedDegrees < 0) {
      rotatedDegrees += 360;
    }

    // console.log(`{${point.x},${point.y}}`, radians, baseDegrees, rotatedDegrees);

    return rotatedDegrees;
  }

  distanceBetween(other: Point) : number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }

  visiblePoints(points: Point[]) : Point[] {
    const visiblePoints = [];

    const grouped = this.pointsByDegree(points);
    grouped.forEach((item) => {
      visiblePoints.push(item.points[0]);

    });

    return visiblePoints;
  }

  pointsByDegree(points: Point[]) : PointsOnLine[] {
    const otherPoints = points.filter(p => p !== this);
    const grouped = otherPoints.reduce((mapByDegree, otherPoint) => {
      const degrees = this.degreesTo(otherPoint);
      let degreeItem = mapByDegree.find(x => x.degree === degrees);
      if (!degreeItem) {
        degreeItem = {
          degree: degrees,
          points: []
        };
        mapByDegree.push(degreeItem);
      }
      degreeItem.points.push(otherPoint);

      return mapByDegree;
    }, [] as PointsOnLine[])
    
    const sorted = grouped.sort((a, b) => a.degree - b.degree);
    sorted.forEach((item) => {
      item.points = item.points.sort((a,b) => this.distanceBetween(a) - this.distanceBetween(b));
    });

    return grouped;
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

  bestPosition(field : Field) : BestMatch {
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