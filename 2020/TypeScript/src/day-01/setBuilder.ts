export class SetBuilder {

  private process(inputs: number[],numberToInclude: number,currentStack:number[] = [],sets: number[][]) {
    inputs.forEach(input => {
      const possibleStack = currentStack.slice(0);
      possibleStack.push(input);

      if (possibleStack.length < numberToInclude) {
        this.process(inputs, numberToInclude, possibleStack.slice(0), sets);
      } else {
        // Filter out groupings with duplicate entries
        if (new Set(possibleStack).size === possibleStack.length) {
          sets.push(possibleStack.slice(0));
        }
      }
    });
  }

  buildPossibleSets(inputs: number[],numberToInclude: number) : number[][] {
    const sets = [];

    if (numberToInclude < 1) {
      return sets;
    }

    inputs.sort();

    this.process(inputs, numberToInclude, [], sets);

    return sets;
  }
}
