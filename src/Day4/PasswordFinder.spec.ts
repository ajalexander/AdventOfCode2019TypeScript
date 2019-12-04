import { expect } from 'chai';
import 'mocha';

import { PasswordFinder } from './PasswordFinder';

describe('PasswordFinder', () => {
  let finder;

  beforeEach(() => {
    finder = new PasswordFinder();
  });

  describe('findPasswords', () => {
    it('should include example 112233', () => {
      const matches = finder.findPasswords(112233, 112233);
      expect(matches).to.contain(112233);
    });

    it('should exclude 223450 (decreasing digits)', () => {
      const matches = finder.findPasswords(223450, 223450);
      expect(matches).not.to.contain(223450);
    });

    it('should exclude 123789 (no duplicates)', () => {
      const matches = finder.findPasswords(123789, 123789);
      expect(matches).not.to.contain(123789);
    });

    it('should exclude 1111 (too few digits)', () => {
      const matches = finder.findPasswords(1111, 1111);
      expect(matches).not.to.contain(1111);
    });

    it('should exclude 11112222 (too many digits)', () => {
      const matches = finder.findPasswords(11112222, 11112222);
      expect(matches).not.to.contain(11112222);
    });

    it('should exclude 123444 (sequence too long)', () => {
      const matches = finder.findPasswords(123444, 123444);
      expect(matches).not.to.contain(123444);
    });

    it('should include 111122', () => {
      const matches = finder.findPasswords(111122, 111122);
      expect(matches).to.contain(111122);
    });
  });
});
