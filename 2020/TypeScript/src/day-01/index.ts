import { problemInputs } from './data';

const inputs = problemInputs;

const targetSum = 2020;

const solveForTwo = () => {
  inputs.forEach(item => {
    inputs.forEach(otherItem => {
      if (item === otherItem) {
        return;
      }
  
      if ((item + otherItem) === targetSum) {
        const product = item * otherItem;
        console.log(`The product of ${item} and ${otherItem} = ${product}`);
      }
    });
  });
};

const solveForThree = () => {
  inputs.forEach(item1 => {
    inputs.forEach(item2 => {
      if (item1 === item2) {
        return;
      }
      inputs.forEach(item3 => {
        if (item1 === item3 || item2 === item3) {
          return;
        }
    
        if ((item1 + item2 + item3) === targetSum) {
          const product = item1 * item2 * item3;
          console.log(`The product of ${item1}, ${item2}, and ${item3} = ${product}`);
        }
      });
    });
  });
};

solveForTwo();
solveForThree();
