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
        const entries = parseInputs(this.inputLines);
        const summedValue = entries.map(entry => {
            const mappedValues = this.deduce(entry.inputValues);

            let calculated = 0;
            entry.outputValues.forEach(value => {
                calculated *= 10;
                calculated += mappedValues[value];
            });

            return calculated;
        }).reduce((prev, curr) => prev + curr, 0);

        console.log(`The sum of the output values is ${summedValue}`);
    }

    private identifySignals(values: string[]): string[]{
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

    private deduce(values: string[]) {
        const identified = this.identifySignals(values);

        this.deduceSixes(values, identified);
        this.deduceFives(values, identified);

        const map: {[key: string]: number} = {};
        identified.forEach((value, index) => map[value] = index);

        return map;
    }

    private deduceFives(values: string[], identified: string[]) {
        const fives = values.filter(value => value.length === 5);
        fives.forEach(value => {
            if (this.isSubset(identified[1], value)) {
                identified[3] = value;
            } else if (this.intersection(identified[4], value).length === 3) {
                identified[5] = value;
            } else {
                identified[2] = value;
            }
        });
    }

    private deduceSixes(values: string[], identified: string[]) {
        const sixes = values.filter(value => value.length === 6);
        sixes.forEach(value => {
            if (this.isSubset(identified[4], value)) {
                identified[9] = value;
            } else if (!this.isSubset(identified[7], value)) {
                identified[6] = value;
            } else {
                identified[0] = value;
            }
        });
    }

    private isSubset(possibleSubset: string, totalSet: string) {
        return possibleSubset.split('').every(element => totalSet.includes(element));
    }

    private intersection(left: string, right: string) {
        return left.split('').filter(element => right.includes(element)).join('');
    }
}
