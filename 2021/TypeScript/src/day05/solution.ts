import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface Position {
    x: number;
    y: number;
}

class Line {
    readonly start: Position;
    readonly end: Position;

    constructor(start: Position, end: Position) {
        this.start = start;
        this.end = end;
    }

    distance(): number {
        return Math.abs(this.start.x - this.end.x) + Math.abs(this.start.y - this.end.y);
    }

    positionsCovered(): Position[] {
        const positions = [];

        const shiftValue = (start: number, end: number) => {
            if (start === end) {
                return 0;
            }
            if (start > end) {
                return -1;
            }
            return 1;
        }

        const xShift = shiftValue(this.start.x, this.end.x);
        const yShift = shiftValue(this.start.y, this.end.y);

        for (let i = 0; i <= this.distance(); i += 1) {
            const x = this.start.x + xShift * i;
            const y = this.start.y + yShift * i;

            positions.push({x, y});
        }
    
        return positions;
    }
    
    isHorizontal(): boolean {
        return this.start.y === this.end.y;
    }
    
    isVertical(): boolean {
        return this.start.x === this.end.x;
    }

    isDiagonal(): boolean {
        return !this.isHorizontal() && !this.isVertical();
    }
}

class SeafloorMap {
    private readonly grid: number[][];

    constructor(lines: Line[]) {
        this.grid = [];

        this.initialize(lines);
        this.addLines(lines);
    }

    print() {
        this.grid.forEach(line => {
            console.log(line.join('').replace(/0/g, '.'));
        })
    }

    overlappingPositions(): Position[] {
        const positions: Position[] = [];
        for (let y = 0; y < this.grid.length; y += 1) {
            for (let x = 0; x < this.grid[y].length; x += 1) {
                if (this.grid[y][x] > 1) {
                    positions.push({x, y});
                }
            }
        }
        return positions;
    }

    private initialize(lines: Line[]) {
        const maximums = this.findMaximums(lines);

        for (let y = 0; y <= maximums.y; y += 1) {
            this.grid[y] = [];

            for (let x = 0; x <= maximums.x; x += 1) {
                this.grid[y][x] = 0;
            }
        }
    }

    private findMaximums(lines: Line[]) {
        let maximumX = -1;
        let maximumY = -1;

        lines.forEach(line => {
            if (line.start.x > maximumX) {
                maximumX = line.start.x;
            }
            if (line.end.x > maximumX) {
                maximumX = line.end.x;
            }
            if (line.start.y > maximumY) {
                maximumY = line.start.y;
            }
            if (line.end.y > maximumY) {
                maximumY = line.end.y;
            }
        });

        return {
            x: maximumX,
            y: maximumX,
        };
    }

    private addLines(lines: Line[]) {
        lines.forEach(line => {
            line.positionsCovered().forEach(position => {
                this.addPosition(position);
            });
        });
    }

    private addPosition(position: Position) {
        this.grid[position.y][position.x] = this.grid[position.y][position.x] + 1;
    }
}

const coordinateStringToPosition = (coordinateString: string): Position => {
    const [x, y] = coordinateString.split(',');
    return {
        x: parseInt(x),
        y: parseInt(y),
    };
};

const parseInputs = (lines: string[]): Line[] => {
    return lines.map(line => {
        const [startCoordinates, endCoordinates] = line.split(' -> ');
        return new Line(
            coordinateStringToPosition(startCoordinates),
            coordinateStringToPosition(endCoordinates),
        );
    });
};

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 5;
    }

    partOne(): void {
        const lines = parseInputs(this.inputLines).filter(line => line.isHorizontal() || line.isVertical());

        const map = new SeafloorMap(lines);
        // map.print();

        const overlappingPositions = map.overlappingPositions();

        console.log(`There are ${overlappingPositions.length} overlapping positions`);
    }

    partTwo(): void {
    }
}
