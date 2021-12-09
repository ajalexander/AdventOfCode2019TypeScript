import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface Position {
    x: number;
    y: number;
}

interface PositionHeight {
    position: Position;
    height: number;
}

class FloorMap {
    private readonly heightValues: PositionHeight[];

    constructor() {
        this.heightValues = [];
    }

    addValue(x: number, y: number, height: number) {
        this.heightValues.push({
            position: {
                x,
                y,
            },
            height,
        });
    }

    valueAt(x: number, y: number) {
        return this.heightValues.find(value => value.position.x === x && value.position.y === y);
    }

    neighborsOf(position: Position) {
        const neighbors: PositionHeight[] = [];
        this.addItemToList(position.x - 1, position.y, neighbors);
        this.addItemToList(position.x + 1, position.y, neighbors);
        this.addItemToList(position.x, position.y - 1, neighbors);
        this.addItemToList(position.x, position.y + 1, neighbors);
        return neighbors;
    }

    findLowPoints(): PositionHeight[] {
        return this.heightValues.filter(value => this.neighborsOf(value.position).every(neighbor => value.height < neighbor.height));
    }

    private addItemToList(x: number, y: number, list: PositionHeight[]) {
        const value = this.valueAt(x, y);
        if (value) {
            list.push(value);
        }
    }
}

const buildMap = (inputLines: string[]): FloorMap => {
    const floorMap = new FloorMap();

    inputLines.forEach((line, y) => {
        line.split('').forEach((height, x) => { 
            floorMap.addValue(x, y, parseInt(height));
        });
    });

    return floorMap;
}

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 9;
    }

    partOne(): void {
        const floorMap = buildMap(this.inputLines);
        const lowPoints = floorMap.findLowPoints();
        const riskLevel = lowPoints.map(value => value.height).reduce((prev, curr) => prev + curr + 1, 0);

        console.log(`The risk level from the ${lowPoints.length} low points is ${riskLevel}`);
    }

    partTwo(): void {
    }
}
