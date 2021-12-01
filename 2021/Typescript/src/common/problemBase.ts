export abstract class ProblemBase {
    abstract day(): number;
    abstract partOne(): void;
    abstract partTwo(): void;

    run() {
        console.log(`= Executing code for day ${this.day()} =`);
        console.log();

        this.runPart(this.partOne, 1);
        this.runPart(this.partTwo, 2);
    }

    private runPart(partFunction: () => void, partNumber: number) {
        console.log(`== Executing part ${partNumber} ==`);

        const before = new Date().getTime();
        partFunction();
        const after = new Date().getTime();

        const duration = after - before;

        console.log(`== Elapsed time: ${duration} ms ==`);
        console.log();
    }
}
