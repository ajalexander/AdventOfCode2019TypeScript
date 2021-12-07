import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

const parseInputs = (inputLine: string): number[] => inputLine.split(',').map(n => parseInt(n));

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 6;
    }

    partOne(): void {
        this.findFuelCost((delta) => delta);
    }

    partTwo(): void {
        this.findFuelCost((delta) => {
            let cost = 0;
            for (let stepCost = 1; stepCost <= delta; stepCost += 1) {
                cost += stepCost;
            }
            return cost;
        });
    }

    private findFuelCost(costStepFunction: (delta: number) => number): void {
        const originalPositions = parseInputs(this.inputLines[0]);
        const sorted = originalPositions.sort();
        const minimum = sorted[0];
        const maximum = sorted[sorted.length - 1];

        let bestValue = -1;
        let bestFuel = Infinity;

        for (let targetPosition = minimum; targetPosition <= maximum; targetPosition += 1) {
            const fuelValues = originalPositions.map(position => costStepFunction(Math.abs(targetPosition - position)));
            const fuelValue = fuelValues.reduce((previous, current) => previous + current);
            if (fuelValue < bestFuel) {
                bestFuel = fuelValue;
                bestValue = targetPosition;
            }
        }

        console.log(`The best target position is ${bestValue} with a fuel cost of ${bestFuel}`);
    }
}
