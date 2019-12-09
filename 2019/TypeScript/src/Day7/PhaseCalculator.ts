import { CodeProcessor, ProgramState } from './CodeProcessor';
import { ChainedIOManager } from './IOManager';

export interface BestThrusterValues { 
  phaseSignals: number[];
  signal: number;
}

interface PhaseElements {
  ioManager: ChainedIOManager;
  processor: CodeProcessor;
  state: ProgramState;
}

export class PhaseCalculator {
  private buildPhaseElements(steps: number, codeString: string) : PhaseElements[] {
    const elements = [];
    const ioManagers = [];

    for (let index = 0; index < steps; index += 1) {
      const ioManager = new ChainedIOManager(ioManagers[index - 1]);
      const processor = new CodeProcessor(ioManager);
      const state = new ProgramState(codeString.split(',').map(s => parseInt(s)));
      const phaseElement : PhaseElements = {
        ioManager: ioManager,
        processor: processor,
        state: state
      };

      elements.push(phaseElement);
      ioManagers.push(ioManager);
    }
    return elements;
  }

  calculate(codeString: string, values: number[]) : number {
    const phaseElements = this.buildPhaseElements(values.length, codeString);
    phaseElements.forEach((phaseElement, index) => {
      phaseElement.ioManager.addToInputBuffer(values[index]);
      if (index === 0) {
        phaseElement.ioManager.addToInputBuffer(0);
      }
    });

    phaseElements.forEach((phaseElement) => {
      phaseElement.processor.processCodes(phaseElement.state);
    });
    
    const finalOutput = phaseElements[values.length - 1].ioManager.outputBuffer;
    return finalOutput[finalOutput.length - 1];
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