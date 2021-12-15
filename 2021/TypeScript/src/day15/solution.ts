import { FileBasedProblemBase } from "../common/problemBase";
import { Queue } from '../common/queue';

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface PositionedValue {
    x: number;
    y: number;
    value: number;
}

class Grid {
    private readonly mappedValues: PositionedValue[][];
    private readonly width: number;
    private readonly height: number;

    constructor(values: PositionedValue[]) {
        this.mappedValues = [];
        values.map(value => value.y).forEach(y => this.mappedValues[y] = []);
        values.forEach(value => this.mappedValues[value.y][value.x] = value);
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
        riskScores[startingPoint.y][startingPoint.x] = 0;

        const queue = new Queue<PositionedValue>([startingPoint]);

        while (!queue.isEmpty()) {
            const current = queue.dequeue() as PositionedValue;

            this.neighborsOf(current).forEach(neighbor => {
                const calculatedValue = riskScores[current.y][current.x] + neighbor.value;
                if (riskScores[neighbor.y][neighbor.x] > calculatedValue) {
                    riskScores[neighbor.y][neighbor.x] = calculatedValue;
                    queue.enqueue(neighbor);
                }
            });
        }

        const finalPoint = this.finalPoint();
        return riskScores[finalPoint.y][finalPoint.x];
    }

    private neighborsOf(value: PositionedValue) {
        const neighbors: PositionedValue[] = [];
        this.addValueIfPresent(value.x - 1, value.y, neighbors);
        this.addValueIfPresent(value.x + 1, value.y, neighbors);
        this.addValueIfPresent(value.x, value.y - 1, neighbors);
        this.addValueIfPresent(value.x, value.y + 1, neighbors);
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

const setupPositionedValues = (inputLines: string[], timesToRepeat = 1) => {
    const positionedValues: PositionedValue[] = [];

    const height = inputLines.length;
    const width = inputLines[0].length;

    for (let yShift = 0; yShift < timesToRepeat; yShift += 1) {
        for (let xShift = 0; xShift < timesToRepeat; xShift += 1) {
            for (let y = 0; y < inputLines.length; y += 1) {
                for (let x = 0; x < inputLines[y].length; x += 1) {
                    const value = (parseInt(inputLines[y][x]) + yShift + xShift);
                    const shiftedValue = (value > 9) ? value % 9 : value;
                    positionedValues.push({
                        x: x + width * xShift,
                        y: y + height * yShift,
                        value: shiftedValue,
                    })
                }
            }
        }
    }

    return positionedValues;
};

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 15;
    }

    partOne(): void {
        const values = setupPositionedValues(this.inputLines);
        const grid = new Grid(values);
        const risk = grid.riskToEnd();

        console.log(`The minimum risk score is ${risk}`);
    }

    partTwo(): void {
        const values = setupPositionedValues(this.inputLines, 5);
        const grid = new Grid(values);
        const risk = grid.riskToEnd();

        console.log(`The minimum risk score is ${risk}`);
    }
}
