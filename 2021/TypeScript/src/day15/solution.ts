import { FileBasedProblemBase } from "../common/problemBase";
import { Queue } from '../common/queue';

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface Position {
    x: number;
    y: number;
}

interface PositionedValue {
    position: Position;
    value: number;
}

class Grid {
    private readonly mappedValues: PositionedValue[][];
    private readonly width: number;
    private readonly height: number;

    constructor(values: PositionedValue[]) {
        this.mappedValues = [];
        values.map(value => value.position.y).forEach(y => this.mappedValues[y] = []);
        values.forEach(value => this.mappedValues[value.position.y][value.position.x] = value);
        this.height = this.mappedValues.length;
        this.width = this.mappedValues[0].length;
    }

    riskToEnd() {
        const riskScores: number[][] = [];
        for (let y = 0; y < this.height; y += 1) {
            riskScores[y] = [];
            for (let x = 0; x < this.width; x += 1) {
                riskScores[y][x] = Number.MAX_SAFE_INTEGER;
            }
        }

        const startingPoint = this.startingPoint();
        riskScores[startingPoint.position.y][startingPoint.position.x] = 0;

        const queue = new Queue<PositionedValue>([startingPoint]);

        while (!queue.isEmpty()) {
            const current = queue.dequeue() as PositionedValue;

            this.neighborsOf(current).forEach(neighbor => {
                const calculatedValue = riskScores[current.position.y][current.position.x] + neighbor.value;
                if (riskScores[neighbor.position.y][neighbor.position.x] > calculatedValue) {
                    riskScores[neighbor.position.y][neighbor.position.x] = calculatedValue;
                    queue.enqueue(neighbor);
                }
            });
        }

        const finalPoint = this.finalPoint();
        return riskScores[finalPoint.position.y][finalPoint.position.x];
    }

    private neighborsOf(value: PositionedValue) {
        const neighbors: PositionedValue[] = [];
        this.addValueIfPresent(value.position.x - 1, value.position.y, neighbors);
        this.addValueIfPresent(value.position.x + 1, value.position.y, neighbors);
        this.addValueIfPresent(value.position.x, value.position.y - 1, neighbors);
        this.addValueIfPresent(value.position.x, value.position.y + 1, neighbors);
        return neighbors;

    }

    private addValueIfPresent(x: number, y: number, collection: PositionedValue[]) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            collection.push(this.mappedValues[y][x]);
        }
    }

    private startingPoint() {
        return this.mappedValues[0][0];
    }

    private finalPoint() {
        return this.mappedValues[this.height - 1][this.width - 1];
    }
}

const parseInputs = (inputLines: string[]) => {
    const positionedValues: PositionedValue[] = [];

    for (let y = 0; y < inputLines.length; y += 1) {
        for (let x = 0; x < inputLines[y].length; x += 1) {
            positionedValues.push({
                position: {
                    x,
                    y,
                },
                value: parseInt(inputLines[y][x]),
            })
        }
    }

    return new Grid(positionedValues);
};

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 15;
    }

    partOne(): void {
        const grid = parseInputs(this.inputLines);
        const risk = grid.riskToEnd();

        console.log(`The minimum risk score is ${risk}`);
    }

    partTwo(): void {
    }
}
