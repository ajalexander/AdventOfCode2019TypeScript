import { FileBasedProblemBase } from "../common/problemBase";
import { Stack } from '../common/stack';

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface PairedSet {
    opening: string;
    closing: string;
    illegalScore: number;
    completedScore: number;
}

interface ParseResult {
    isCorrupt: boolean;
    isComplete: boolean;
    score: number;
}

const matchingSets: PairedSet[] = [
    { opening: '(', closing: ')', illegalScore: 3, completedScore: 1 },
    { opening: '[', closing: ']', illegalScore: 57, completedScore: 2 },
    { opening: '{', closing: '}', illegalScore: 1197, completedScore: 3 },
    { opening: '<', closing: '>', illegalScore: 25137, completedScore: 4 },
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
        const score = corrupted.map(result => result.score).reduce((prev, curr) => prev + curr, 0);

        console.log(`The score for finding the ${corrupted.length} corrupted lines is ${score}`);
    }

    partTwo(): void {
        const parsedResults = this.inputLines.map(line => this.parse(line));
        const incomplete = parsedResults.filter(result => !result.isCorrupt && !result.isComplete);
        const sorted = incomplete.sort((left, right) => left.score - right.score);
        const middle = sorted[(sorted.length  - 1) / 2];

        console.log(`The middle score for completing the ${incomplete.length} incomplete lines is ${middle.score}`);
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
                    return { isCorrupt: true, isComplete: false, score: set.illegalScore };
                }
            }
        }

        let score = 0;
        while (!currentStack.isEmpty()) {
            score *= 5;
            score += this.findSet(currentStack.pop()).completedScore;
        }

        return { isCorrupt: false, isComplete: score === 0, score };
    }

    private findSet(character: string | undefined) {
        return matchingSets.filter(set => set.opening === character || set.closing === character)[0];
    }

    private isOpening(character: string, set: PairedSet) {
        return character === set.opening;
    }
}
