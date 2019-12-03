export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class PathTracer {
  tracePoints(path: string) : Coordinate[] {
    console.log(`Tracing Path: ${path}`);
    
    const pathSteps = path.split(',').map(s => s.trim());
    const points = [];

    let currentPoint = new Coordinate(0, 0);
    pathSteps.forEach((step: string) => {
      const direction = step[0];
      const amount = parseInt(step.slice(1));

      let xShift = 0;
      let yShift = 0;

      switch(direction) {
        case 'U':
          yShift = 1;
          break;
        case 'D':
          yShift = -1;
          break;
        case 'L':
          xShift = -1;
          break;
        case 'R':
          xShift = 1;
          break;
      }

      for (let i = 0; i < amount; i += 1) {
        const newPoint = new Coordinate(currentPoint.x + xShift, currentPoint.y + yShift);
        points.push(newPoint);
        currentPoint = newPoint;
      }
    });

    return points;
  }
}
