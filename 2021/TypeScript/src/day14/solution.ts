import { GroupedFileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface CharacterCount {
    character: string;
    count: number;
}

const parseInsertions = (lines: string[]) => {
    return lines.reduce((map, line) => {
        const [match, insertion] = line.split(' -> ');
        map[match] = insertion;
        return map;
    }, {} as {[key: string]: string});
};

const parseInputs = (groups: string[][]) => {
    return {
        starting: groups[0][0],
        insertions: parseInsertions(groups[1]),
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
        const parsed = parseInputs(this.inputGroups);

        let state = parsed.starting;
        for (let i = 0; i < 10; i += 1) {
            state = this.step(state, parsed.insertions);
        }

        const counts = this.characterCounts(state);
        const maximum = counts[0].count;
        const minimum = counts[counts.length - 1].count;

        console.log(`The quantity is ${maximum - minimum}`);
    }

    partTwo(): void {
    }

    private step(currentState: string, insertions: {[key: string]: string}): string {
        let nextState = '';
        for (let i = 0; i < currentState.length - 1; i++) {
            const toEvaluate = currentState.substring(i, i + 2);
            const toInsert = insertions[toEvaluate];

            nextState += toEvaluate[0];
            if (toInsert) {
                nextState += toInsert;
            }
        }
        nextState += currentState[currentState.length - 1];

        return nextState;
    }

    private characterCounts(input: string) {
        const map: {[key: string]: CharacterCount} = {};

        for (let i = 0; i < input.length; i += 1) {
            const character = input[i];
            if (!map[character]) {
                map[character] = { character, count: 0 };
            }
            map[character].count = map[character].count + 1;
        }

        return Object.values(map).sort((a, b) => b.count - a.count);
    }
}
