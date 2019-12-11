import { expect } from 'chai';
import 'mocha';

import { InMemoryBufferIOManager } from './IOManager';

describe('InMemoryBufferIOManager', () => {
  let ioManager;

  beforeEach(() => {
    ioManager = new InMemoryBufferIOManager();``
  });

  describe('input', () => {
    it('should return nothing if buffer is empty', () => {
      expect(ioManager.input()).to.equal(undefined);
    });

    it('should return from buffer', () => {
      ioManager.addToInputBuffer(1);
      expect(ioManager.input()).to.equal(1);
      expect(ioManager.inputBuffer).to.eql([]);
    });
  });

  describe('output', () => {
    it('should add to output buffer', () => {
      ioManager.output(1);
      expect(ioManager.outputBuffer).to.eql([1]);
    });
  });
});
