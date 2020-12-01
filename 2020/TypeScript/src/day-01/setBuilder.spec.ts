import { expect } from 'chai';
import 'mocha';

import { SetBuilder } from './setBuilder';

describe('SetBuilder', () => {
  let target: SetBuilder;

  beforeEach(() => {
    target = new SetBuilder();
  });

  describe('buildPossibleSets', () => {
    const compareSets = (actual, expected) => {
      expect(actual).to.have.lengthOf(expected.length);

      expected.forEach(expectedSet => {
        const foundMatch = actual.some(actualSet => JSON.stringify(actualSet) === JSON.stringify(expectedSet));
        expect(foundMatch).to.eq(true, `Looking for a match of ${expectedSet}`);
      });
    };

    it('should return empty when empty inputs', () => {
      const result = target.buildPossibleSets([], 3);
      expect(result).to.to.have.lengthOf(0);
    });

    it('should return empty when target number is 0', () => {
      const result = target.buildPossibleSets([ 1, 2, 3 ], 0);
      expect(result).to.to.have.lengthOf(0);
    });

    it('should return results with 2 elements per set', () => {
      const result = target.buildPossibleSets([ 1, 2, 3 ], 2);
      compareSets(result, [
        [ 1, 2 ],
        [ 1, 3 ],
        [ 2, 1 ],
        [ 2, 3 ],
        [ 3, 1 ],
        [ 3, 2 ],
      ]);
    });

    it('should return results with 3 elements per set', () => {
      const result = target.buildPossibleSets([1, 2, 3, 4], 3);
      compareSets(result, [
        [ 1, 2, 3 ],
        [ 1, 2, 4 ],
        [ 1, 3, 2 ],
        [ 1, 3, 4 ],
        [ 1, 4, 2 ],
        [ 1, 4, 3 ],
        [ 2, 1, 3 ],
        [ 2, 1, 4 ],
        [ 2, 3, 1 ],
        [ 2, 3, 4 ],
        [ 2, 4, 1 ],
        [ 2, 4, 3 ],
        [ 3, 1, 2 ],
        [ 3, 1, 4 ],
        [ 3, 2, 1 ],
        [ 3, 2, 4 ],
        [ 3, 4, 1 ],
        [ 3, 4, 2 ],
        [ 4, 1, 2 ],
        [ 4, 1, 3 ],
        [ 4, 2, 1 ],
        [ 4, 2, 3 ],
        [ 4, 3, 1 ],
        [ 4, 3, 2 ]
      ]);
    });
  });
});
