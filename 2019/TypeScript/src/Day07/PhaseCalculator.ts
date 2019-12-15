import { CodeProcessor, ProgramState, HaltReason } from '../Common/CodeProcessor';
import { ChainedIOManager } from '../Common/IOManager';

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
  private buildPhaseElements(steps: number, codeString: string, feedbackMode: boolean) : PhaseElements[] {
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

    if (feedbackMode) {
      elements[0].ioManager.feeder = elements[steps - 1].ioManager;
    }

    return elements;
  }

  calculate(codeString: string, values: number[], feedbackMode: boolean = false) : number {
    const phaseElements = this.buildPhaseElements(values.length, codeString, feedbackMode);
    phaseElements.forEach((phaseElement, index) => {
      phaseElement.ioManager.addToInputBuffer(values[index]);
      if (index === 0) {
        phaseElement.ioManager.addToInputBuffer(0);
      }
    });

    const allDone = (phaseElements: PhaseElements[]) => {
      for (let index = 0; index < values.length; index += 1) {
        if (phaseElements[0].state.haltReason !== HaltReason.terminated) {
          return false;
        }
      }
      return true;
    }

    while (!allDone(phaseElements)) {
      phaseElements.forEach((phaseElement) => {
        if (phaseElement.state.haltReason !== HaltReason.terminated) {
          phaseElement.processor.processCodes(phaseElement.state);
          }
      });
    }
    
    const finalOutput = phaseElements[values.length - 1].ioManager.outputBuffer;
    return finalOutput[finalOutput.length - 1];
  }

  private buildPossiblePhases(minimumValue = 0, maximumValue = 4) : number[][] {
    const possibleCombinations = [];

    for (let i = minimumValue; i <= maximumValue; i += 1) {
      for (let j = minimumValue; j <= maximumValue; j += 1) {
        if (i === j) {
          continue;
        }
        for (let k = minimumValue; k <= maximumValue; k += 1) {
          if (k === i || k === j) {
            continue;
          }
          for (let l = minimumValue; l <= maximumValue; l += 1) {
            if (l === i || l === j || l === k) {
              continue;
            }

            for (let m = minimumValue; m <= maximumValue; m += 1) {
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

  private findBestPhaseValuesForType(codeString: string, feedbackMode = false) : BestThrusterValues {
    const possibleCombinations = feedbackMode
      ? this.buildPossiblePhases(5, 9)
      : this.buildPossiblePhases();

    let bestScore = -1;
    let bestValues: number[];

    possibleCombinations.forEach((phaseValues) => {
      const score = this.calculate(codeString, phaseValues, feedbackMode);
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

  findBestPhaseValues(codeString: string) : BestThrusterValues {
    return this.findBestPhaseValuesForType(codeString, false);
  }

  findBestPhaseValuesForFeedback(codeString: string) : BestThrusterValues {
    return this.findBestPhaseValuesForType(codeString, true);
  }
}
