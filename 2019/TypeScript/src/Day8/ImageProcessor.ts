export class Layer {
  rows: number[][];

  constructor() {
    this.rows = [];
  }

  countOfDigit(digit: number) {
    return this.rows
      .map(row => row.filter(x => x === digit).length)
      .reduce((acc, count) => acc + count, 0);
  }
}

export class ImageProcessor {
  width: number;
  height: number;

  constructor(width: number = 25, height: number = 6) {
    this.width = width;
    this.height = height;
  }

  definitionToLayers(imageDefinition: string) : Layer[] {
    const layers = [];

    const digits = imageDefinition.split('').map(s => parseInt(s));
    const digitsPerLayer = this.width * this.height;
    const layerCount = digits.length / digitsPerLayer;

    for (let layerIndex = 0; layerIndex < layerCount; layerIndex += 1) {
      const layerOffset = digitsPerLayer * layerIndex;
      const digitsForLayer = digits.slice(layerOffset, layerOffset + digitsPerLayer);

      const layer = new Layer();
      for (let rowIndex = 0; rowIndex < this.height; rowIndex += 1) {
        const rowOffset = this.width * rowIndex;
        const digitsForRow = digitsForLayer.slice(rowOffset, rowOffset + this.width);
        layer.rows.push(digitsForRow);
      }
      layers.push(layer);
    }

    return layers;
  }
}