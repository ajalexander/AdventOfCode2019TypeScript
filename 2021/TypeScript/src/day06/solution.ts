import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

const spawnInterval = 0;
const newlySpawnedInitialInterval = 8;
const postSpawnResetInterval = 6;

class FishState {
    readonly interval: number;

    constructor(interval: number) {
        this.interval = interval;
    }

    tick(): FishState[] {
        if (this.interval === spawnInterval) {
            return [
                new FishState(postSpawnResetInterval),
                new FishState(newlySpawnedInitialInterval),
            ];
        }

        return [
            new FishState(this.interval - 1),
        ];
    }
}

class SchoolState {
    readonly fishStates: FishState[];

    constructor(fishStates: FishState[]) {
        this.fishStates = fishStates;
    }

    tick(): SchoolState {
        const newFishState = this.fishStates.map(fishState => fishState.tick()).flat();
        return new SchoolState(newFishState);
    }

    toString() {
        return this.fishStates.map(fishState => fishState.interval).join(',');
    }
}

const parseInputs = (input: string) => {
    const fishStates = input.split(',').map(interval => new FishState(parseInt(interval)));
    return new SchoolState(fishStates);
}

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 6;
    }

    partOne(): void {
        let schoolState = parseInputs(this.inputLines[0]);

        for (let day = 1; day <= 80; day += 1) {
            schoolState = schoolState.tick();
            // console.log(`Day ${day}: ${schoolState.toString()}`);
        }

        console.log(`There are ${schoolState.fishStates.length} fish`);
    }

    partTwo(): void {
    }
}
