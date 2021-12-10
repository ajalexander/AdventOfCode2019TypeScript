import { FileBasedProblemBase } from "../common/problemBase";
import { Stack } from '../common/stack';

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface PairedSet {
    opening: string;
    closing: string;
    score: number;
}

interface ParseResult {
    isCorrupt: boolean;
    isComplete: boolean;
    invalidCharacter: string;
}

const matchingSets: PairedSet[] = [
    { opening: '(', closing: ')', score: 3 },
    { opening: '[', closing: ']', score: 57 },
    { opening: '{', closing: '}', score: 1197 },
    { opening: '<', closing: '>', score: 25137 },
];

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 10;
    }

    partOne(): void {
        const parsedResults = this.inputLines.map(line => this.parse(line));
        const corrupted = parsedResults.filter(result => result.isCorrupt);
        const corruptedScores = corrupted.map(result => this.findSet(result.invalidCharacter).score);
        const score = corruptedScores.reduce((prev, curr) => prev + curr, 0);

        console.log(`The score for finding the ${corrupted.length} corrupted lines is ${score}`);
    }

    partTwo(): void {
    }

    private parse(line: string): ParseResult {
        const currentStack = new Stack<string>();

        for (let i = 0; i < line.length; i += 1) {
            const current = line[i];
            const set = this.findSet(current);
            if (this.isOpening(current, set)) {
                currentStack.push(current);
            } else {
                if (currentStack.peek() === set.opening) {
                    currentStack.pop();
                } else {
                    return { isCorrupt: true, isComplete: false, invalidCharacter: current };
                }
            }
        }

        return { isCorrupt: false, isComplete: currentStack.size() === 0, invalidCharacter: '' };
    }

    private findSet(character: string) {
        return matchingSets.filter(set => set.opening === character || set.closing === character)[0];
    }

    private isOpening(character: string, set: PairedSet) {
        return character === set.opening;
    }
}
