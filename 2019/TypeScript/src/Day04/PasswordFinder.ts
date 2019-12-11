export class PasswordFinder {
  private splitIntoDigits(password: number) : number[] {
    const digits = [];
    do {
      digits.push(password % 10);
      password = Math.floor(password / 10);
    } while (password > 0)
    return digits.reverse();
  }

  private checkDigitsIncreasing(digits: number[]) : boolean {
    let previous = -1;
    for (let index = 0; index < digits.length; index += 1) {
      const current = digits[index];
      if (current < previous) {
        return false;
      }
      previous = current;
    }
    return true;
  }

  private hasAdjacentDigit(digits: number[], additionalSequenceChecking: boolean) : boolean {
    let previous = -1;
    let startOfRun = 0;

    const checkRunRequirements = (startOfRun: number, index: number) => {
      const numberInRun = index - startOfRun;
      if (additionalSequenceChecking) {
        if (numberInRun === 2) {
          return true;
        }
      } else if (numberInRun >= 2) {
        return true;
      }
      return false;
    }

    for (let index = 0; index < digits.length; index += 1) {
      const current = digits[index];
      if (previous !== current) {
        if (checkRunRequirements(startOfRun, index)) {
          return true;
        }
        startOfRun = index;
      }
      previous = current;
    }
    return checkRunRequirements(startOfRun, digits.length);
  }

  private hasCorrectNumberOfDigits(digits: number[]) : boolean {
    return digits.length === 6;
  }

  findPasswords(minimum: number, maximum: number, additionalSequenceChecking = true) : number[] {
    const matchingPasswords = [];
    for (let current = minimum; current <= maximum; current += 1) {
      const digits = this.splitIntoDigits(current);

      if (!this.checkDigitsIncreasing(digits)) {
        continue;
      }
      if (!this.hasAdjacentDigit(digits, additionalSequenceChecking)) {
        continue;
      }
      if (!this.hasCorrectNumberOfDigits(digits)) {
        continue;
      }

      matchingPasswords.push(current);
    }
    return matchingPasswords;
  }
}
