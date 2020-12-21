import { GroupedFileInputChallenge } from "../common/dayChallenge";

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

class ImageSquare {
  readonly tileNumber: number;
  private readonly points: string[];

  above?: ImageSquare;
  left?: ImageSquare;
  below?: ImageSquare;
  right?: ImageSquare;
  
  private widthWithFrame(): number {
    return this.points.length;
  }
  
  private heightWithFrame(): number {
    return this.points[0].length;
  }

  constructor(tileNumber: number, points: string[]) {
    this.tileNumber = tileNumber;
    this.points = points;
  }

  rows(): string[] {
    return this.points.slice(0);
  }

  imageWithoutFrame(): string[] {
    return this.points
      .slice(1, this.heightWithFrame() - 1)
      .map(row => row.substring(1, row.length - 1));
  }

  topEdge(): string {
    return this.points[0];
  }

  leftEdge(): string {
    return this.points.map(row => row[0]).reverse().join('');
  }

  bottomEdge(): string {
    return this.points[this.widthWithFrame() - 1].split('').reverse().join('');
  }

  rightEdge(): string {
    return this.points.map(row => row[this.heightWithFrame() - 1]).join('');
  }

  partiallyPlaced(): boolean {
    return this.matchedSides() > 0;
  }

  matchedSides(): number {
    return [this.above, this.left, this.below, this.right].filter(Boolean).length;
  }

  edges(): string[] {
    return [
      this.topEdge(),
      this.leftEdge(),
      this.bottomEdge(),
      this.rightEdge(),
    ];
  }

  flippedEdges(): string[] {
    return [
      this.topEdge().split('').reverse().join(''),
      this.leftEdge().split('').reverse().join(''),
      this.bottomEdge().split('').reverse().join(''),
      this.rightEdge().split('').reverse().join(''),
    ];
  }

  flip() {
    this.points.forEach((row, index) => {
      this.points[index] = row.split('').reverse().join('');
    });

    [this.left, this.right] = [this.right, this.left];
  }

  rotateLeft() {
    const rotated = [];

    for (let index = 0; index < this.widthWithFrame(); index += 1) {
      rotated[index] = [];
    }

    for (let rowIndex = 0; rowIndex < this.widthWithFrame(); rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < this.heightWithFrame(); columnIndex += 1) {
        rotated[this.heightWithFrame() - 1 - columnIndex][rowIndex] = this.points[rowIndex].charAt(columnIndex);
      }
    }

    this.points.forEach((_, index) => {
      this.points[index] = rotated[index].join('');
    });

    [this.above, this.left, this.below, this.right] = [this.right, this.above, this.left, this.below];
  }

  print() {
    this.points.forEach(row => {
      console.log(row);
    })
  }
}

class ImageParser {
  static parse(groups: string[][]): ImageSquare[] {
    return groups.map(group => {
      const tileNumber = group[0].match(/Tile (.*)/)[1];
      return new ImageSquare(parseInt(tileNumber), group.slice(1));
    });
  }
}

class ImageSquireOrienter {
  private static findMatchForEdge(edge: string, otherSquares: ImageSquare[]) {
    return otherSquares.find(other => {
      if (other.edges().includes(edge)) {
        return true;
      }

      if (other.flippedEdges().includes(edge)) {
        return true;
      }

      return false;
    });
  }

  private static findCorners(imageSquares: ImageSquare[]): ImageSquare[] {
    return imageSquares.filter(square => {
      const matchingEdges = square.edges().filter(edge => {
        return imageSquares.some(other => {
          if (other === square) {
            return false;
          }

          if (other.edges().includes(edge)) {
            return true;
          }

          if (other.flippedEdges().includes(edge)) {
            return true;
          }

          return false;
        });
      });

      return matchingEdges.length === 2;
    });
  }

  private static tryToOrientToTopLeft(square: ImageSquare, others: ImageSquare[]) {
    for (let i = 0; i < 4; i += 1) {
      const matchOnBottom = this.findMatchForEdge(square.bottomEdge(), others);
      const matchOnRight = this.findMatchForEdge(square.rightEdge(), others);
      if (matchOnBottom && matchOnRight) {
        return true;
      }
      square.rotateLeft();
    }

    return false;
  }

  private static orientCornerToTopLeft(square: ImageSquare, others: ImageSquare[]) {
    if (!this.tryToOrientToTopLeft(square, others)) {
      square.flip();
      this.tryToOrientToTopLeft(square, others);
    }
  }

  private static tryToOrientTileToRight(square: ImageSquare, squareToRight: ImageSquare): boolean {
    for (let i = 0; i < 4; i += 1) {
      if (squareToRight.leftEdge().split('').reverse().join('') === square.rightEdge()) {
        square.right = squareToRight;
        squareToRight.left = square;
        return true;
      }

      squareToRight.rotateLeft();
    }

    return false;
  }

  private static placeTileToRight(square: ImageSquare, unmatched: ImageSquare[]) {
    const squareToRight = this.findMatchForEdge(square.rightEdge(), unmatched);
    if (!squareToRight) {
      return null;
    }

    unmatched.splice(unmatched.indexOf(squareToRight), 1);

    if (!this.tryToOrientTileToRight(square, squareToRight)) {
      squareToRight.flip();
      this.tryToOrientTileToRight(square, squareToRight);
    }

    return squareToRight;
  }

  private static tryToOrientTileToBottom(square: ImageSquare, squareToBottom: ImageSquare): boolean {
    for (let i = 0; i < 4; i += 1) {
      if (squareToBottom.topEdge().split('').reverse().join('') === square.bottomEdge()) {
        square.below = squareToBottom;
        squareToBottom.above = square;
        return true;
      }

      squareToBottom.rotateLeft();
    }

    return false;
  }

  private static placeTileToBottom(square: ImageSquare, unmatched: ImageSquare[]) {
    const squareToBottom = this.findMatchForEdge(square.bottomEdge(), unmatched);
    if (!squareToBottom) {
      return null;
    }

    unmatched.splice(unmatched.indexOf(squareToBottom), 1);

    if (!this.tryToOrientTileToBottom(square, squareToBottom)) {
      squareToBottom.flip();
      this.tryToOrientTileToBottom(square, squareToBottom);
    }

    return squareToBottom;
  }

  private static completeConnections(corner: ImageSquare) {
    let rowAbove = corner;
    let currentRow = corner.below;

    while (currentRow) {
      let current = currentRow;
      let above = rowAbove;
      while (current) {
        current.above = above;
        above.below = current;

        current = current.right;
        above = above.right;
      }

      rowAbove = currentRow;
      currentRow = currentRow.below;
    }
  }

  private static placeImages(corner: ImageSquare, unmatched: ImageSquare[]) {
    let currentRow = corner;
    while (currentRow) {
      let current = currentRow;
      while (current) {
        current = this.placeTileToRight(current, unmatched);
      }
      currentRow = this.placeTileToBottom(currentRow, unmatched);
    }
  }

  static reorientImages(imageSquares: ImageSquare[]): ImageSquare {
    const corners = this.findCorners(imageSquares);
    const corner = corners[0];
    corner.flip();
    const unmatched = imageSquares.filter(square => square !== corner);

    this.orientCornerToTopLeft(corner, unmatched);
    this.placeImages(corner, unmatched);
    this.completeConnections(corner);

    return corner;
  }
}

class CombinedImage extends ImageSquare {
  static convertRowToImage(leftmost: ImageSquare): string[] {
    const rows = leftmost.imageWithoutFrame();
    let current = leftmost.right;
    while (current) {
      current.imageWithoutFrame().forEach((imagePart, index) => {
        rows[index] += imagePart;
      });
      current = current.right;
    }
    return rows;
  }

  static convertToImage(corner: ImageSquare): string[] {
    const rows = [];
    let current = corner;
    while (current) {
      rows.push(...this.convertRowToImage(current));
      current = current.below;
    }
    return rows;
  }

  constructor(corner: ImageSquare) {
    const imageDefinition = CombinedImage.convertToImage(corner);
    super(null, imageDefinition);
  }
}

class MonsterFinder {
  static lengthOfMonster() {
    return 15;
  }

  private static countMonstersInOrientation(image: CombinedImage) {
    const monsterDefinition = {
      row1: /..................#./,
      row2: /#....##....##....###/,
      row3: /.#..#..#..#..#..#.../,
    };

    let foundCount = 0;
    const rows = image.rows();
    for (let rowIndex = 0; rowIndex < rows.length - 2; rowIndex += 1) {
      if (rows[rowIndex].match(monsterDefinition.row1) && rows[rowIndex + 1].match(monsterDefinition.row2) && rows[rowIndex + 2].match(monsterDefinition.row3)) {
        foundCount += 1;
      }
    }
    return foundCount;
  }

  private static countMonstersOnSide(image: CombinedImage) {
    let foundCount = 0;
    for (let i = 0; i < 4; i += 1) {
      foundCount += this.countMonstersInOrientation(image);
      image.rotateLeft();
    }
    return foundCount;
  }

  static countMonsters(image: CombinedImage) {
    let foundCount = this.countMonstersOnSide(image);

    if (!foundCount) {
      image.flip();
      foundCount = this.countMonstersOnSide(image);
    }

    return foundCount;
  }
}

export class Solution extends GroupedFileInputChallenge {
  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 20;
  }

  partOne(): void {
    const images = ImageParser.parse(this.groups);
    ImageSquireOrienter.reorientImages(images);

    const corners = images.filter(image => image.matchedSides() === 2);

    const product = corners.reduce((acc, image) => acc * image.tileNumber, 1);

    console.log(`The product of the corners is ${product}`);
  }

  partTwo(): void {
    const images = ImageParser.parse(this.groups);
    const corner = ImageSquireOrienter.reorientImages(images);

    const combinedImage = new CombinedImage(corner);
    const monstersFound = MonsterFinder.countMonsters(combinedImage);

    console.log(`There are ${monstersFound} monsters in the image`);

    const pointsOfInterest = combinedImage.rows()
      .map(row => row.split('#').length - 1)
      .reduce((acc, value) => acc + value, 0);

    const waterPoints = pointsOfInterest - monstersFound * MonsterFinder.lengthOfMonster();
    console.log(`There are ${waterPoints} spots of water in the image`);
  }
}
