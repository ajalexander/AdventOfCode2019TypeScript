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

export enum Color {
  black = 0,
  white = 1,
  transparent = 2
}

export class RenderedImage {
  pixels: Color[][];

  constructor(width: number, height: number) {
    this.pixels = [];

    const transparentRow = [];
    for (let index = 0; index < width; index += 1) {
      transparentRow.push(Color.transparent);
    }

    for (let rowIndex = 0; rowIndex < height; rowIndex += 1) {
      this.pixels.push(transparentRow.slice(0));
    }
  }

  printToScreen() {
    this.pixels.forEach((row) => {
      const printed = row.map((value) => {
        switch(value) {
          case 0:
            return '.';
          case 1:
            return '%';
          default:
            return ' ';
        }
      }).join('');
      console.log(printed);
    });
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

  private valueToColor(value: number) {
    switch(value) {
      case 0:
        return Color.black;
      case 1:
        return Color.white;
    }
    return Color.transparent;;
  }

  render(layers: Layer[]) : RenderedImage {
    const rendered = new RenderedImage(this.width, this.height);

    layers.forEach((layer) => {
      for (let rowIndex = 0; rowIndex < this.height; rowIndex += 1) {
        for (let columnIndex = 0; columnIndex < this.width; columnIndex += 1) {
          const currentColor = rendered.pixels[rowIndex][columnIndex];
          const layerColor = this.valueToColor(layer.rows[rowIndex][columnIndex]);

          if (currentColor == Color.transparent && layerColor != Color.transparent) {
            rendered.pixels[rowIndex][columnIndex] = layerColor;
          }
        }
      }
    });

    return rendered;
  }
}