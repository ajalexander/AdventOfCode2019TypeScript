import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface ParsedContentItem {
  quantity: number;
  color: string;
}

interface ContentItem {
  quantity: number;
  item: BagDefinition;
}

class BagDefinition {
  private containedDefinitions: Set<BagDefinition>;

  color: string;
  contains: ContentItem[];
  containedBy: Set<BagDefinition>;

  constructor(color: string) {
    this.color = color;
    this.containedDefinitions = new Set();
    this.contains = [];
    this.containedBy = new Set();
  }

  addContent(quantity: number, item: BagDefinition) {
    this.containedDefinitions.add(item);
    this.contains.push({
      quantity: quantity,
      item: item
    });
    item.containedBy.add(this);
  }

  countContainedBags() : number {
    return this.contains.reduce((acc, item) => acc + item.quantity + item.quantity * item.item.countContainedBags(), 0);
  }
}

interface BagMap {
  [key: string]: BagDefinition;
}

export class Solution extends FileInputChallenge {
  private static parseContents(contents: string) : ParsedContentItem[] {
    const contentsRegex = /^(\d+) ([^,]+) bag(s?)$/;

    return contents.split(',').map(s => s.trim()).map(content => {
      const contentMatch = content.match(contentsRegex);
      if (!contentMatch) {
        return null;
      }
      const quantity = parseInt(contentMatch[1]);
      const item = contentMatch[2].toString();
      return {
        quantity: quantity,
        color: item
      } as ParsedContentItem;
    }).filter(result => !!result);
  }

  private static createDefinition(color: string) : BagDefinition {
    return new BagDefinition(color);
  }

  private static getBagFromMap(color: string, map: BagMap) : BagDefinition {
    let definition = map[color];
    if (!definition) {
      definition = Solution.createDefinition(color);
      map[color] = definition;
    }
    return definition;
  }

  private static parseRule(ruleLine: string, map: BagMap) {
    const basicsRegex = /^(.*) bags contain (.*).$/;

    const basicsMatch = ruleLine.match(basicsRegex);

    const containerColor = basicsMatch[1].toString();
    const contentDefinition = basicsMatch[2].toString();
    const contents = Solution.parseContents(contentDefinition);

    contents.forEach(content => {
      const containerDefinition = Solution.getBagFromMap(containerColor, map);
      const containedDefinition = Solution.getBagFromMap(content.color, map);

      containerDefinition.addContent(content.quantity, containedDefinition);
    });
  }

  private static parseRules(ruleLines: string[]) : BagMap {
    const map = {} as BagMap;
    
    ruleLines.forEach(rule => Solution.parseRule(rule, map));

    return map;
  }

  private static findPossibleContainers(color: string, map: BagMap) {
    const target = map[color];
    const processed = new Set();
    const toProcess = [target];
    const possibleContainers: Set<BagDefinition> = new Set();

    while (toProcess.length > 0) {
      const current = toProcess.shift();
      if (!processed.has(current)) {
        current.containedBy.forEach(container => {
          possibleContainers.add(container);
          toProcess.push(container);
        });
      }
    }

    return possibleContainers;
  }

  private colorTarget(): string {
    return 'shiny gold';
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 7;
  }

  partOne(): void {
    const map = Solution.parseRules(this.lines);
    const possibleContainers = Solution.findPossibleContainers(this.colorTarget(), map);
    console.log(`There are ${possibleContainers.size} possible containers for the ${this.colorTarget()} bag`);
  }

  partTwo(): void {
    const map = Solution.parseRules(this.lines);
    const target = map[this.colorTarget()];
    console.log(`The ${target.color} bag contains ${target.countContainedBags()} other bags`);
  }
}
