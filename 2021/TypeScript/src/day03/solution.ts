import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface PowerRates {
    gamma: number;
    epsilon: number;
}

interface LifeSupportRates {
    oxygenRating: number;
    co2Rating: number;
}

export class Solution extends FileBasedProblemBase {
    readonly inputLength: number;

    constructor() {
        super(inputPath);
        this.inputLength = this.inputLines[0].length;
    }

    day(): number {
        return 3;
    }

    partOne(): void {
        const parsed = this.findGammaAndEpsilon();

        console.log(`Calculated inputs of: gamma - ${parsed.gamma}, epsilon - ${parsed.epsilon}`);
        console.log(`Calculated power consumption: ${parsed.gamma * parsed.epsilon}`);
    }

    partTwo(): void {
        const parsed = this.findLifeSupportRates();

        console.log(`Calculated inputs of: oxygen - ${parsed.oxygenRating}, co2 - ${parsed.co2Rating}`);
        console.log(`Calculated life support: ${parsed.oxygenRating * parsed.co2Rating}`);
    }

    private findGammaAndEpsilon(): PowerRates {
        let gammaString = '';
        let epsilonString = '';

        const transposed = this.transposeInputs(this.inputLines);

        for (let position = 0; position < transposed.length; position += 1) {
            const significant = this.findSignificantBits(transposed[position]);
            
            gammaString += significant.most;
            epsilonString += significant.least;
        }

        return {
            gamma: parseInt(gammaString, 2),
            epsilon: parseInt(epsilonString, 2),
        };
    }

    private findLifeSupportRates(): LifeSupportRates {
        const oxygenRating = this.findLifeSupportValue(true);
        const co2Rating = this.findLifeSupportValue(false);
        
        return {
            oxygenRating,
            co2Rating,
        };
    }

    private findLifeSupportValue(mostSignificant: boolean): number {
        let possibleValues = this.inputLines.slice();
        
        for (let position = 0; position < this.inputLength && possibleValues.length > 1; position += 1) {
            const transposed = this.transposeInputs(possibleValues);
            const significant = this.findSignificantBits(transposed[position]);

            let filterValue: string;
            if (significant.counts.zeros === significant.counts.ones) {
                filterValue = mostSignificant ? '1' : '0';
            }
            else {
                filterValue = mostSignificant ? significant.most : significant.least;
            }
            
            possibleValues = possibleValues.filter(item => item[position] === filterValue);
        }

        return parseInt(possibleValues[0], 2);
    }

    private findSignificantBits(input: number[]) {
        const counted = this.countBitValues(input);

        const least = (counted.zeros > counted.ones) ? '1' : '0';
        const most = (counted.zeros > counted.ones) ? '0' : '1';

        return {
            most,
            least,
            counts: counted,
        };
    }

    private countBitValues(input: number[]) {
        const zeros = input.filter(value => value === 0).length;
        const ones = input.filter(value => value === 1).length;

        return {
            zeros,
            ones,
        };
    }

    private transposeInputs(input: string[]): number[][] {
        const transposed = [];
        for (let position = 0; position < this.inputLength; position += 1) {
            transposed[position] = input.map(line => parseInt(line[position]));
        }
        return transposed;
    }
}
