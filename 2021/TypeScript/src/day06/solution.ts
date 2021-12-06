import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

const spawnInterval = 0;
const newlySpawnedInitialInterval = 8;
const postSpawnResetInterval = 6;

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 6;
    }

    partOne(): void {
        this.runForDays(80);
    }

    partTwo(): void {
        this.runForDays(256);
    }

    private runForDays(dayCount: number) {
        const state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.inputLines[0].split(',').map(item => parseInt(item)).forEach(item => state[item] += 1);

        for (let day = 1; day <= dayCount; day += 1) {
            const spawnCount = state[spawnInterval];

            for (let i = 1; i <= newlySpawnedInitialInterval; i += 1) {
                state[i - 1] = state[i];
            }

            state[postSpawnResetInterval] += spawnCount;
            state[newlySpawnedInitialInterval] = spawnCount;

            const fishCount = state.reduce((previous, current) => previous + current);

            console.log(`After ${day} days there are ${fishCount} fish`);
        }
    }
}
