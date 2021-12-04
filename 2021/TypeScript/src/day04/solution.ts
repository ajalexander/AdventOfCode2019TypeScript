import { GroupedFileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

const gridSize = 5;
const columnWidth = 2;

interface WinningState {
    drawnNumber: number;
    board: BoardState;
}

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
        const columns: number[][] = this.grid.map(() => []);
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
        const completedStates = this.runToCompletion();
        if (completedStates.length > 0) {
            const firstCompletion = completedStates[0];
            const unmarkedValues = firstCompletion.board.sumUnmarked();

            console.log(`The board score is ${unmarkedValues * firstCompletion.drawnNumber}`);
        } else {
            console.error('Failed to find a winning state');
        }
    }

    partTwo(): void {
        const completedStates = this.runToCompletion();
        if (completedStates.length > 0) {
            const lastCompletion = completedStates[completedStates.length - 1];
            const unmarkedValues = lastCompletion.board.sumUnmarked();

            console.log(`The board score is ${unmarkedValues * lastCompletion.drawnNumber}`);
        } else {
            console.error('Failed to find a winning state');
        }
    }

    private runToCompletion(): WinningState[] {
        const gameState = parseInputs(this.inputGroups);
        const boardCompletions: WinningState[] = [];
        const incompleteBoards = gameState.boards.slice();

        for (let drawIndex = 0; drawIndex < gameState.drawnNumbers.length; drawIndex += 1) {
            const drawnNumber = gameState.drawnNumbers[drawIndex];
            incompleteBoards.forEach(board => board.addNumber(drawnNumber));

            const winningBoards = incompleteBoards.filter(board => board.hasWon());
            winningBoards.forEach(winningBoard => {
                boardCompletions.push({
                    drawnNumber,
                    board: winningBoard,
                });
                incompleteBoards.splice(incompleteBoards.indexOf(winningBoard), 1);
            });
        }

        return boardCompletions;
    }
}
