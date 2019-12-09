import { ImageProcessor, Layer } from './ImageProcessor';
import Input from './Input';

const processor = new ImageProcessor();
const layers = processor.definitionToLayers(Input);

let lowestCount = Number.POSITIVE_INFINITY;
let bestLayer : Layer;
layers.forEach((layer, _) => {
  const zeroCount = layer.countOfDigit(0);
  if (zeroCount < lowestCount) {
    lowestCount = zeroCount;
    bestLayer = layer;
  }
});

const onesInLayer = bestLayer.countOfDigit(1);
const twosInLayer = bestLayer.countOfDigit(2);
console.log(`There are ${onesInLayer} (1s) x ${twosInLayer} (2s) = ${onesInLayer * twosInLayer}`);

const rendered = processor.render(layers);
rendered.printToScreen();
