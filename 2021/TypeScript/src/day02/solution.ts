import { ProblemBase } from "../common/problemBase";
import { actual, example } from './inputs';

const input = actual;

class PositionState {
    readonly horizontal: number;
    readonly depth: number;
    constructor(horizontal: number = 0, depth: number = 0) {
        this.horizontal = horizontal;
        this.depth = depth;
    }

    forward(amount: number) {
        return new PositionState(this.horizontal + amount, this.depth);
    }

    up(amount: number) {
        return new PositionState(this.horizontal, this.depth - amount);
    }

    down(amount: number) {
        return new PositionState(this.horizontal, this.depth + amount);
    }
}

export class Solution extends ProblemBase {
    day(): number {
        return 2;
    }

    partOne(): void {
        let position = new PositionState();

        input.forEach(instruction => {
            const [direction, amount] = instruction.split(' ');
            const parsedAmount = parseInt(amount);
            switch (direction) {
                case 'forward':
                    position = position.forward(parsedAmount);
                    break;
                case 'up':
                    position = position.up(parsedAmount);
                    break;
                case 'down':
                    position = position.down(parsedAmount);
                    break;
            }
        });

        console.log(`Final position - horizontal: ${position.horizontal}, vertical: ${position.depth}`);
        console.log(`Position sun: ${position.horizontal * position.depth}`);
    }

    partTwo(): void {
    }
}
