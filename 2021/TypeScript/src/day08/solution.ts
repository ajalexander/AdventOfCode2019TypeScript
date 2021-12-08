import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface SignalEntry {
    inputValues: string[];
    outputValues: string[];
}

const parseInputs = (inputLines: string[]): SignalEntry[] => {
    const sortValue = (value: string) => value.split('').sort().join('');
    return inputLines.map(line => {
        const [inputSegment, outputSegment] = line.split(' | ');
        const inputValues = inputSegment.split(' ').map(sortValue);
        const outputValues = outputSegment.split(' ').map(sortValue);
        return {
            inputValues,
            outputValues,
        };
    })
}

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 6;
    }

    partOne(): void {
        const entries = parseInputs(this.inputLines);
        const identifiedCount = entries.map(entry => {   
            const identified = this.identifySignals(entry.outputValues);
            const identifiedDigits = identified.map((identifiedValue) => {
                return entry.outputValues.filter(value => value === identifiedValue).length;
            }).reduce((prev, curr) => prev + curr, 0);
            return identifiedDigits;
        }).reduce((prev, curr) => prev + curr, 0);

        console.log(`There were ${identifiedCount} output digits identified`);
    }

    partTwo(): void {
    }

    private identifySignals(values: string[]): string[] {
        const identified: string[] = [];

        this.identify1(values, identified);
        this.identify4(values, identified);
        this.identify7(values, identified);
        this.identify8(values, identified);

        return identified;
    }

    private identify1(values: string[], identified: string[]) {
        const value = values.find(value => value.length === 2);
        if (value) {
            identified[1] = value;
        }
    }

    private identify4(values: string[], identified: string[]) {
        const value = values.find(value => value.length === 4);
        if (value) {
            identified[4] = value;
        }
    }

    private identify7(values: string[], identified: string[]) {
        const value = values.find(value => value.length === 3);
        if (value) {
            identified[7] = value;
        }
    }

    private identify8(values: string[], identified: string[]) {
        const value = values.find(value => value.length === 7);
        if (value) {
            identified[8] = value;
        }
    }
}
