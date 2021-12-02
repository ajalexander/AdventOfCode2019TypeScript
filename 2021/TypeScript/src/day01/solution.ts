import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 1;
    }

    partOne(): void {
        this.countIncrease(this.inputLines, 1);
    }

    partTwo(): void {
        this.countIncrease(this.inputLines, 3);
    }

    private countIncrease(input: string[], rangeSize: number) {
        const parsedInput = this.convertInput(input);
        const ranges = this.captureSlidingRanges(parsedInput, rangeSize);

        let increasingCount = 0;
        for (let i = 1; i < ranges.length; i++) {
            if (ranges[i] > ranges[i - 1]) {
                increasingCount += 1;
            }
        }

        console.log(`The distance increased ${increasingCount} times`);
    }

    private convertInput(input: string[]): number[] {
        return input.map(item => parseInt(item));
    }

    private captureSlidingRanges(input: number[], rangeSize: number): number[] {
        const ranges = [];
        for (let i = 0; i <= input.length - rangeSize; i++) {
            const sum = input.slice(i, i + rangeSize).reduce((previous, current) => previous + current);
            ranges.push(sum);
        }
        return ranges;
    }
}
