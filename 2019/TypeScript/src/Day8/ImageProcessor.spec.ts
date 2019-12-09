import { expect } from 'chai';
import 'mocha';

import { ImageProcessor, Layer } from './ImageProcessor';

describe('ImageProcessor', () => {
  let processor;

  beforeEach(() => {
    processor = new ImageProcessor();
  });

  describe('definitionToLayers', () => {
    it('should build layers', () => {
      processor = new ImageProcessor(3, 2);
      const layers = processor.definitionToLayers('123456789012');

      expect(layers.length).to.equal(2);

      expect(layers[0].rows.length).to.equal(2);
      expect(layers[0].rows[0]).to.eql([1,2,3]);
      expect(layers[0].rows[1]).to.eql([4,5,6]);

      expect(layers[1].rows.length).to.equal(2);
      expect(layers[1].rows[0]).to.eql([7,8,9]);
      expect(layers[1].rows[1]).to.eql([0,1,2]);
    });
  });
});

describe('Layer', () => {
  describe('countOfDigit', () => {
    it('should count values', () => {
      const layer = new Layer();
      layer.rows.push([1,2,3,4]);
      layer.rows.push([0,2,2,0]);

      expect(layer.countOfDigit(0)).to.equal(2);
      expect(layer.countOfDigit(1)).to.equal(1);
      expect(layer.countOfDigit(2)).to.equal(3);
      expect(layer.countOfDigit(3)).to.equal(1);
    });
  });
});
