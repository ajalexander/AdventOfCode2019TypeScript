import { ProblemBase } from "../common/problemBase";
import { actual, example } from './inputs';

const input = actual;

export class Solution extends ProblemBase {
    day(): number {
        return 1;
    }

    partOne(): void {
        Solution.countIncrease(input, 1);
    }

    partTwo(): void {
        Solution.countIncrease(input, 3);
    }

    private static countIncrease(input: string[], rangeSize: number) {
        const parsedInput = Solution.convertInput(input);
        const ranges = Solution.captureSlidingRanges(parsedInput, rangeSize);

        let increasingCount = 0;
        for (let i = 1; i < ranges.length; i++) {
            if (ranges[i] > ranges[i - 1]) {
                increasingCount += 1;
            }
        }

        console.log(`The distance increased ${increasingCount} times`);
        
    }

    private static convertInput(input: string[]): number[] {
        return input.map(item => parseInt(item));
    }

    private static captureSlidingRanges(input: number[], rangeSize: number): number[] {
        let ranges = [];
        for (let i = 0; i <= input.length - rangeSize; i++) {
            let sum = input.slice(i, i + rangeSize).reduce((previous, current) => previous + current);
            ranges.push(sum);
        }
        return ranges;
    }
}
