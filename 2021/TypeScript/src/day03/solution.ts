import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface PowerRates {
    gamma: number;
    epsilon: number;
}

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 3;
    }

    partOne(): void {
        const parsed = this.parseInputs();

        console.log(`Calculated inputs of: gamma - ${parsed.gamma}, epsilon - ${parsed.epsilon}`);
        console.log(`Calculated power consumption: ${parsed.gamma * parsed.epsilon}`);
    }

    partTwo(): void {
    }

    private parseInputs(): PowerRates {
        let gammaString = '';
        let epsilonString = '';

        const transposed = this.transposeInputs();

        for (let position = 0; position < transposed.length; position += 1) {
            const zeros = transposed[position].filter(value => value === 0).length;
            const ones = transposed[position].filter(value => value === 1).length;

            const least = (zeros > ones) ? '1' : '0';
            const most = (zeros > ones) ? '0' : '1';
            
            gammaString += most;
            epsilonString += least;
        }

        return {
            gamma: parseInt(gammaString, 2),
            epsilon: parseInt(epsilonString, 2),
        };
    }

    private transposeInputs(): number[][] {
        const transposed = [];
        const inputLength = this.inputLines[0].length;
        for (let position = 0; position < inputLength; position += 1) {
            transposed[position] = this.inputLines.map(line => parseInt(line[position]));
        }
        return transposed;
    }
}
