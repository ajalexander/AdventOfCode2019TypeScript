import { problemInputs } from './data';
import { SetBuilder } from './setBuilder';

const inputs = problemInputs;

const targetSum = 2020;

const solve = (numberOfInputs: number) => {
  const sets = new SetBuilder().buildPossibleSets(inputs, numberOfInputs);

  sets.forEach(set => {
    let sum = 0;
    let product = 1;

    set.forEach(item => {
      sum += item;
      product *= item;
    });

    if (sum === targetSum) {
      console.log(`The product of [${set}] is ${product}`);
    }
  });
};

solve(2);
solve(3);
