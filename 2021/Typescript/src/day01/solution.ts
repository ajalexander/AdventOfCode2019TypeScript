import { ProblemBase } from "../common/problemBase";
import { actual, example } from './inputs';

const input = actual;

export class Solution extends ProblemBase {
    day(): number {
        return 1;
    }

    partOne(): void {
        const parsedInput = Solution.convertInput(input);

        let increasingCount = 0;
        for (let i = 1; i < parsedInput.length; i++) {
            if (parsedInput[i] > parsedInput[i - 1]) {
                increasingCount += 1;
            }
        }

        console.log(`The distance increased ${increasingCount} times`);
    }

    partTwo(): void {
    }

    private static convertInput(input: string[]): number[] {
        return input.map(item => parseInt(item));
    }
}
