import { GroupedFileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface CharacterCount {
    character: string;
    count: number;
}

interface Transformation {
    from: string;
    to: string[];
}

interface PairedState {
    starting: string;
    ending: string;
    total: {[key: string]: number};
}

const parseTransformations = (lines: string[]): Transformation[] => {
    return lines.map(line => {
        const [match, insertion] = line.split(' -> ');
        return {
            from: match,
            to: [match[0] + insertion, insertion + match[1]]
        }
    });
};

const parseInitialState = (line: string): PairedState => {
    const initialState: {[key: string]: number} = {};

    for (let i = 0; i < line.length - 1; i += 1) {
        const key = line.substring(i, i + 2);
        if (!initialState[key]) {
            initialState[key] = 0;
        }
        initialState[key] = initialState[key] + 1;
    }

    return {
        starting: line[0],
        ending: line[line.length - 1],
        total: initialState,
    };
};

const parseInputs = (groups: string[][]) => {
    return {
        starting: parseInitialState(groups[0][0]),
        transformations: parseTransformations(groups[1]),
    };
};

export class Solution extends GroupedFileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 14;
    }

    partOne(): void {
        this.runTimes(10);
    }

    partTwo(): void {
        this.runTimes(40);
    }

    private runTimes(steps: number) {
        const parsed = parseInputs(this.inputGroups);

        let state = parsed.starting;
        
        for (let i = 0; i < steps; i += 1) {
            state = this.runTransformations(state, parsed.transformations);
        }

        const counts = this.characterCounts(state);
        const maximum = counts[0].count;
        const minimum = counts[counts.length - 1].count;

        console.log(`The quantity is ${maximum - minimum}`);
    }

    private runTransformations(currentState: PairedState, transformations: Transformation[]): PairedState {
        const nextState: {[key: string]: number} = {};

        transformations.forEach(transformation => {
            transformation.to.forEach(transformed => {
                if (!nextState[transformed]) {
                    nextState[transformed] = 0;
                }
                nextState[transformed] = nextState[transformed] + (currentState.total[transformation.from] || 0);
            });
        });

        return {
            starting: currentState.starting,
            ending: currentState.ending,
            total: nextState,
        };
    }

    private characterCounts(state: PairedState) {
        const map: {[key: string]: CharacterCount} = {};

        Object.keys(state.total).forEach(key => {
            const character = key[0];
            this.addToCount(map, character, state.total[key]);
        });

        this.addToCount(map, state.ending, 1);

        return Object.values(map).sort((a, b) => b.count - a.count);
    }

    private addToCount(map: {[key: string]: CharacterCount}, character: string, toAdd: number) {
        if (!map[character]) {
            map[character] = { character, count: 0 };
        }
        map[character].count = map[character].count + toAdd;
    }
}
