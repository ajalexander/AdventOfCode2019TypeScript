import { DayChallenge } from '../common/dayChallenge';
import { FileReader } from '../common/fileUtils';

// const inputPath = './src/day-07/example.txt';
const inputPath = './src/day-07/problemInput.txt';

class BagDefinition {
  color: string;
  contains: Set<BagDefinition>;
  containedBy: Set<BagDefinition>;

  constructor(color: string) {
    this.color = color;
    this.contains = new Set();
    this.containedBy = new Set();
  }

  addContent(content: BagDefinition) {
    this.contains.add(content);
    content.containedBy.add(this);
  }
}

interface BagMap {
  [key: string]: BagDefinition;
}

export class Solution extends DayChallenge {
  private lines: string[];

  private static parseContents(contents: string) : string[] {
    const contentsRegex = /^(\d+) ([^,]+) bag(s?)$/;

    return contents.split(',').map(s => s.trim()).map(content => {
      const contentMatch = content.match(contentsRegex);
      if (contentMatch) {
        return contentMatch[2];
      }
      return null;
    }).filter(s => !!s);
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
    const contents = basicsMatch[2].toString();
    const containedColors = Solution.parseContents(contents);

    containedColors.forEach(containedColor => {
      const containerDefinition = Solution.getBagFromMap(containerColor, map);
      const containedDefinition = Solution.getBagFromMap(containedColor, map);

      containerDefinition.addContent(containedDefinition);
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

  constructor() {
    super();
    const reader = new FileReader();
    this.lines = reader.readFile(inputPath);
  }

  dayNumber(): number {
    return 7;
  }

  partOne(): void {
    const map = Solution.parseRules(this.lines);
    const possibleContainers = Solution.findPossibleContainers('shiny gold', map);
    console.log(`There are ${possibleContainers.size} possible containers for the shiny gold bag`);
  }

  partTwo(): void {
    throw new Error('Method not implemented.');
  }
}
