import { CodeProcessor, ProgramState } from './CodeProcessor';
import { AlternatingInputOutputIOManager } from './IOManager';

export interface BestThrusterValues { 
  phaseSignals: number[];
  signal: number;
}

export class PhaseCalculator {
  private ioManager: AlternatingInputOutputIOManager;
  private codeProcessor: CodeProcessor;

  constructor() {
    this.ioManager = new AlternatingInputOutputIOManager();
    this.codeProcessor = new CodeProcessor(this.ioManager);
  }

  setupPhases(values: number[]) {
    values.forEach((phaseValue) => {
      this.ioManager.addToInputBuffer(phaseValue);
    });
  }

  calculate(codeString: string, values: number[]) : number {
    values.forEach((phaseValue) => {
      const state = new ProgramState(codeString.split(',').map(s => parseInt(s)));
      this.ioManager.addToInputBuffer(phaseValue);
      this.codeProcessor.processCodes(state);
    });
    
    return this.ioManager.outputBuffer[this.ioManager.outputBuffer.length - 1];
  }

  buildPossiblePhases() : number[][] {
    const possibleCombinations = [];

    const maxValue = 4;
    for (let i = 0; i <= maxValue; i += 1) {
      for (let j = 0; j <= maxValue; j += 1) {
        if (i === j) {
          continue;
        }
        for (let k = 0; k <= maxValue; k += 1) {
          if (k === i || k === j) {
            continue;
          }
          for (let l = 0; l <= maxValue; l += 1) {
            if (l === i || l === j || l === k) {
              continue;
            }

            for (let m = 0; m <= maxValue; m += 1) {
              if (m === i || m === j || m === k || m === l) {
                continue;
              }

              possibleCombinations.push([i, j, k, l, m]);
            }
          }
        }
      }
    }

    return possibleCombinations;
  }

  findBestPhaseValues(codeString: string) : BestThrusterValues {
    const possibleCombinations = this.buildPossiblePhases();

    let bestScore = -1;
    let bestValues: number[];

    possibleCombinations.forEach((phaseValues) => {
      this.ioManager.reset();
      const score = this.calculate(codeString, phaseValues);
      if (score > bestScore) {
        bestScore = score;
        bestValues = phaseValues;
      }
    });
    
    return {
      phaseSignals: bestValues,
      signal: bestScore,
    } as BestThrusterValues;
  }
}