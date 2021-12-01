import { ProblemBase } from "./common/problemBase";

const dayNumber = () => parseInt(process.argv[2]);
const paddedDay = (dayNumber: number) => dayNumber.toString().padStart(2, '0');
const buildImportPath = (dayNumber: number) => `./day${paddedDay(dayNumber)}/solution.js`;
const importRunner = async (dayNumber: number) => await import(buildImportPath(dayNumber));
const constructRunner = async (dayNumber: number): Promise<ProblemBase> => {
    const module = await importRunner(dayNumber);
    return new module.Solution() as ProblemBase;
}

const runDay = async (dayNumber: number) => {
    const solution = await constructRunner(dayNumber);
    solution.run();
}

if (process.argv.length === 3) {
    runDay(dayNumber());
} else {
    console.error('Expected to receive the day number as a command-line argument');
}
