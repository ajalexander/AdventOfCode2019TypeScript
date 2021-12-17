import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface Inputs {
    x: {
        minimum: number;
        maximum: number;
    };
    y: {
        minimum: number;
        maximum: number;
    }
}

const parseInputs = (line: string): Inputs => {
    const match = line.match(/x=(.*)\.\.(.*), y=(.*)\.\.(.*)/);
    if (!match) {
        throw new Error();
    }

    return {
        x: {
            minimum: parseInt(match[1]),
            maximum: parseInt(match[2]),
        },
        y: {
            minimum: parseInt(match[3]),
            maximum: parseInt(match[4]),
        }
    };
};

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 17;
    }

    partOne(): void {
        const inputs = parseInputs(this.inputLines[0]);

        let maximumHeight = Number.MIN_SAFE_INTEGER;
        const maximumY = this.getMaxSearchSpaceY(inputs);
        for (let x = 0; x <= inputs.x.maximum; x += 1) {
            for (let y = 0; y <= maximumY; y += 1) {
                let position = { x: 0, y: 0 };
                let velocity = { x, y };
                let inZone = false;
                let localMaximumHeight = 0;
                
                while (position.x < inputs.x.maximum && position.y > inputs.y.minimum && !inZone) {
                    position.x += velocity.x;
                    position.y += velocity.y;

                    if (velocity.x > 0) {
                        velocity.x -= 1;
                    }
                    velocity.y -= 1;

                    if (position.y > localMaximumHeight) {
                        localMaximumHeight = position.y;
                    }

                    inZone = position.x >= inputs.x.minimum && position.x <= inputs.x.maximum && position.y >= inputs.y.minimum && position.y <= inputs.y.maximum;
                }

                if (inZone && localMaximumHeight > maximumHeight) {
                    maximumHeight = localMaximumHeight;
                }
            }
        }

        console.log(`The maximum height on a path that lands in the target zone is ${maximumHeight}`);
    }

    partTwo(): void {
    }

    // Since the y changes are symmetrical, the largest Y value can at most be the positive
    // version of the minimum target Y value
    private getMaxSearchSpaceY(inputs: Inputs) {
        return Math.abs(inputs.y.minimum);
    }

    // The largest X value can at most be the positive version of the maximum target X value
    private getMaxSearchSpaceX(inputs: Inputs) {
        return Math.abs(inputs.x.maximum);
    }
}
