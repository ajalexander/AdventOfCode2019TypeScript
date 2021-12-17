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

interface TrajectoryResult {
    initialVelocity: {
        x: number;
        y: number;
    },
    maximumHeight: number;
    landedInZone: boolean;
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

        const validTrajectories = this.findValidTrajectories(inputs);
        const highestTrajectory = validTrajectories.sort((a, b) => b.maximumHeight - a.maximumHeight)[0];

        console.log(`The maximum height on a path that lands in the target zone is ${highestTrajectory.maximumHeight}`);
    }

    partTwo(): void {
        const inputs = parseInputs(this.inputLines[0]);

        const validTrajectories = this.findValidTrajectories(inputs);

        console.log(`There are ${validTrajectories.length} trajectories that land in the target zone`);
    }

    private findValidTrajectories(inputs: Inputs) {
        const validTrajectories: TrajectoryResult[] = [];

        for (let x = 0; x <= inputs.x.maximum; x += 1) {
            for (let y = inputs.y.minimum; y <= Math.abs(inputs.y.minimum); y += 1) {
                const trajectoryResult = this.tryTrajectory(x, y, inputs);
                if (trajectoryResult.landedInZone) {
                    validTrajectories.push(trajectoryResult);
                }
            }
        }

        return validTrajectories;
    }

    private tryTrajectory(x: number, y: number, inputs: Inputs): TrajectoryResult {
        const position = { x: 0, y: 0 };
        const velocity = { x, y };
        let landedInZone = false;
        let maximumHeight = 0;
        
        while (position.x <= inputs.x.maximum && position.y >= inputs.y.minimum && !landedInZone) {
            position.x += velocity.x;
            position.y += velocity.y;

            if (velocity.x > 0) {
                velocity.x -= 1;
            }
            velocity.y -= 1;

            if (position.y > maximumHeight) {
                maximumHeight = position.y;
            }

            landedInZone = this.positionInRange(position.x, position.y, inputs);
        }

        return {
            initialVelocity: { x, y },
            maximumHeight,
            landedInZone: landedInZone
        };
    }

    private positionInRange(x: number, y: number, inputs: Inputs) {
        return x >= inputs.x.minimum && x <= inputs.x.maximum && y >= inputs.y.minimum && y <= inputs.y.maximum;
    }
}
