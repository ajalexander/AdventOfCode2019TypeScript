import { GroupedFileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

const gridSize = 5;
const columnWidth = 2;

class BoardState {
    private readonly grid: number[][];
    readonly markedNumbers: number[];
    readonly allNumbers: number[];

    constructor(boardDefinition: string[]) {
        this.markedNumbers = [];
        this.allNumbers = [];
        this.grid = boardDefinition.map(line => {
            const rowValues: number[] = [];

            for (let i = 0; i < gridSize; i += 1) {
                const startingPosition = i * (columnWidth + 1);
                const parsedNumber = parseInt(line.substring(startingPosition, startingPosition + columnWidth));
                this.allNumbers.push(parsedNumber);
                rowValues.push(parsedNumber);
            }

            return rowValues;
        });
    }

    addNumber(num: number) {
        this.markedNumbers.push(num);
    }

    rows(): number[][] {
        return this.grid.slice();
    }

    columns(): number[][] {
        const columns: number[][] = this.grid.map(_ => []);
        for (let columnIndex = 0; columnIndex < this.grid[0].length; columnIndex += 1) {
            for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex += 1) {
                columns[columnIndex][rowIndex] = this.grid[rowIndex][columnIndex];
            }
        }
        return columns;
    }

    hasWon(): boolean {
        return this.rows().some(row => row.every(item => this.markedNumbers.includes(item)))
            || this.columns().some(row => row.every(item => this.markedNumbers.includes(item)));
    }

    sumMarked(): number {
        return this.allNumbers.filter(n => this.markedNumbers.includes(n)).reduce((previous, current) => previous + current);
    }

    sumUnmarked(): number {
        return this.allNumbers.filter(n => !this.markedNumbers.includes(n)).reduce((previous, current) => previous + current);
    }
}

interface GameState {
    drawnNumbers: number[];
    boards: BoardState[];
}

const parseInputs = (inputGroups: string[][]): GameState => {
    const moves = inputGroups[0][0].split(',').map(n => parseInt(n));
    const boards = inputGroups.slice(1).map(group => new BoardState(group));

    return {
        drawnNumbers: moves,
        boards,
    };
}

export class Solution extends GroupedFileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 4;
    }

    partOne(): void {
        const completedState = this.runToCompletion();
        if (completedState) {
            const unmarkedValues = completedState.winningBoard.sumUnmarked();

            console.log(`The board score is ${unmarkedValues * completedState.drawnNumber}`);
        } else {
            console.error('Failed to find a winning state');
        }
    }

    partTwo(): void {
    }

    private runToCompletion() {
        const gameState = parseInputs(this.inputGroups);
        let drawnNumber = -1;
        for (let drawIndex = 0; drawIndex < gameState.drawnNumbers.length; drawIndex += 1) {
            drawnNumber = gameState.drawnNumbers[drawIndex];
            gameState.boards.forEach(board => board.addNumber(drawnNumber));

            const winningBoard = gameState.boards.find(board => board.hasWon());
            if (winningBoard) {
                return {
                    winningBoard,
                    drawnNumber,
                };
            }

        }

        return null;
    }
}
