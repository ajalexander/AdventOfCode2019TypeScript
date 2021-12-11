import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

const gridSize = 10;

class Octopus {
    energyLevel: number;
    recentlyFlashed: boolean;

    constructor(energyLevel: number) {
        this.energyLevel = energyLevel;
        this.recentlyFlashed = false;
    }

    readyToFlash() {
        return this.energyLevel > 9 && !this.recentlyFlashed;
    }

    reset() {
        this.energyLevel = 0;
        this.recentlyFlashed = false;
    }

    charge() {
        this.energyLevel += 1;
    }

    flash() {
        this.recentlyFlashed = true;
    }
}

interface PositionedOctopus {
    x: number;
    y: number;
    octopus: Octopus;
}

class OctopusGrid {
    private elements: PositionedOctopus[];
    private grid: Octopus[][];
    private stepCount: number;
    private flashedCount: number;

    constructor(elements: PositionedOctopus[]) {
        this.elements = elements;
        this.stepCount = 0;
        this.flashedCount = 0;

        this.grid = [];
        for (let i = 0; i < gridSize; i += 1) {
            this.grid[i] = [];
        }

        elements.forEach(element => this.grid[element.y][element.x] = element.octopus);
    }

    print() {
        console.log(`After ${this.stepCount} step(s) with ${this.flashedCount} total falshes...`);
        console.log();
        this.grid.forEach(row => {
            console.log(row.map(octopus => octopus.energyLevel.toString()).join(''));
        })
        console.log();
    }

    step() {
        this.stepCount += 1;
        this.elements.forEach(element => element.octopus.charge());

        let done = false;
        while (!done) {
            const primed = this.findPrimedOctopuses();

            primed.forEach(element => element.octopus.flash());

            primed.forEach(element => this.findNeighbors(element).forEach(neighbor => neighbor.octopus.charge()));

            done = primed.length === 0;
        }

        const justFlashed = this.elements.filter(element => element.octopus.recentlyFlashed);
        justFlashed.forEach(element => element.octopus.reset());

        this.flashedCount += justFlashed.length;

        // this.print();
    }

    timesFlashed() {
        return this.flashedCount;
    }

    allJustFlashed() {
        return this.elements.every(element => element.octopus.energyLevel === 0);
    }

    private findPrimedOctopuses() {
        return this.elements.filter(element => element.octopus.readyToFlash());
    }

    private findNeighbors(element: PositionedOctopus) {
        return this.elements.filter(other => other !== element && Math.abs(other.x - element.x) <= 1 && Math.abs(other.y - element.y) <= 1);
    }
}

const parseInputs = (inputLines: string[]) => {
    const elements: PositionedOctopus[] = [];

    for (let y = 0; y < gridSize; y += 1) {
        for (let x = 0; x < gridSize; x += 1) {
            elements.push({
                x,
                y,
                octopus: new Octopus(parseInt(inputLines[y][x]))
            });
        }
    }

    return new OctopusGrid(elements);
}

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 11;
    }

    partOne(): void {
        const grid = parseInputs(this.inputLines);
        // grid.print();

        const timesToStep = 100;

        for (let i = 0; i < timesToStep; i += 1) {
            grid.step();
        }

        console.log(`After ${timesToStep} steps that have been ${grid.timesFlashed()} flashes`);
    }

    partTwo(): void {
        const grid = parseInputs(this.inputLines);
        let stepsRequired = 0;

        while (!grid.allJustFlashed()) {
            stepsRequired += 1;
            grid.step();
        }

        console.log(`First reached a syncronized state after ${stepsRequired} steps`);
    }
}
