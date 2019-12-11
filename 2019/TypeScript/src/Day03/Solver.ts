import { IntersectionFinder } from './IntersectionFinder';
import { PathTracer, Coordinate } from './PathTracer';

export class Solver {
  private tracer: PathTracer;
  private finder: IntersectionFinder;

  constructor() {
    this.tracer = new PathTracer();
    this.finder = new IntersectionFinder();
  }

  private countSteps(pathPoints: Coordinate[], targetPoint: Coordinate) {
    let index = 0;
    for (index = 0; index < pathPoints.length; index += 1) {
      if (pathPoints[index].x === targetPoint.x && pathPoints[index].y === targetPoint.y) {
        break;
      }
    }
    
    return index + 1;
  }

  findDistance(path1: string, path2: string) : number {
    const path1Points = this.tracer.tracePoints(path1);
    const path2Points = this.tracer.tracePoints(path2);
    
    const intersections = this.finder.findIntersections(path1Points, path2Points);

    return this.finder.findDistanceOfNearestToOrigin(intersections);
  }

  findFewestSteps(path1: string, path2: string) {
    const path1Points = this.tracer.tracePoints(path1);
    const path2Points = this.tracer.tracePoints(path2);
    
    const intersections = this.finder.findIntersections(path1Points, path2Points);

    let shortestPath = Number.POSITIVE_INFINITY;

    intersections.forEach((point) => {

      const path1Steps = this.countSteps(path1Points, point);
      const path2Steps = this.countSteps(path2Points, point);
      const totalSteps = path1Steps + path2Steps;

      if (totalSteps < shortestPath) {
        shortestPath = totalSteps;
      }
    });

    return shortestPath;
  }
}