import { Coordinate } from './PathTracer';

export class IntersectionFinder {
  private origin = new Coordinate(0, 0);

  findIntersections(path1: Coordinate[], path2: Coordinate[]) : Coordinate[] {
    console.log(`Finding intersections between paths with ${path1.length} and ${path2.length} points`);
    
    return path1.filter(p1 => path2.some(p2 => p1.x === p2.x && p1.y === p2.y));
  }

  calculateDistance(left: Coordinate, right: Coordinate) : number {
    return Math.abs(left.x - right.x) + Math.abs(left.y - right.y);
  }

  sortByDistanceFromOrigin(points: Coordinate[]) : Coordinate[] {
    console.log(`Sorting ${points.length} intersecting points`);

    return points.sort((left, right) => {
      const leftDistance = this.calculateDistance(left, this.origin);
      const rightDistance = this.calculateDistance(right, this.origin);

      if (leftDistance < rightDistance) {
        return -1;
      }
      if (leftDistance > rightDistance) { 
        return 1;
      }
      return 0;
    });
  }

  findDistanceOfNearestToOrigin(points: Coordinate[]) : number {
    const sorted = this.sortByDistanceFromOrigin(points);
    return this.calculateDistance(sorted[0], this.origin);
  }
}
