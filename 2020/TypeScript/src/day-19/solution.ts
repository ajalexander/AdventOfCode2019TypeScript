import { GroupedFileInputChallenge } from "../common/dayChallenge";

// const inputFile = 'example1.txt';
// const inputFile = 'example2.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface RulePart {
  matches(input: string, index: number): number[];
}

class ConstantValue implements RulePart {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  matches(input: string, index: number): number[] {
    if (input[index] === this.value) {
      return [ 1 ];
    }
    return [];
  }

  toString() {
    return `"${this.value}"`;
  }
}

class RulePointer implements RulePart {
  readonly otherRule: number;
  private readonly ruleMap: RuleMap;

  constructor(otherRule: number, ruleMap: RuleMap) {
    this.otherRule = otherRule;
    this.ruleMap = ruleMap;
  }

  matches(input: string, index: number): number[] {
    const otherRule = this.ruleMap[this.otherRule];
    return otherRule.matches(input, index);
  }

  toString() {
    return this.otherRule.toString();
  }
}

class RuleGroup {
  readonly parts: RulePart[];

  constructor(parts: RulePart[]) {
    this.parts = parts;
  }

  match(input: string, index: number): number[] {
    let matchedCharacters = [0];
    for (let partIndex = 0; partIndex < this.parts.length; partIndex += 1) {
      const part = this.parts[partIndex];

      const matchedCharactersAfterPart = [];
      matchedCharacters.forEach(characterCount => {
        const partMatchedCharacters = part.matches(input, index + characterCount);
        partMatchedCharacters.forEach(partMatch => matchedCharactersAfterPart.push(characterCount + partMatch));
      });

      matchedCharacters = matchedCharactersAfterPart;
    }

    return matchedCharacters;
  }

  toString() {
    return this.parts.map(part => part.toString()).join(' ');
  }
}

class Rule {
  readonly ruleNumber: number;
  readonly groups: RuleGroup[];

  constructor(ruleNumber: number, groups: RuleGroup[]) {
    this.ruleNumber = ruleNumber;
    this.groups = groups;
  }

  matches(input: string, index = 0): number[] {
    return this.groups.flatMap(group => group.match(input, index));
  }

  toString() {
    return `${this.ruleNumber}: ${this.groups.map(group => group.toString()).join(' | ')}`;
  }
}

interface RuleMap {
  [ruleNumber: number]: Rule;
}

class RuleParser {
  private static parseConstant(value: string): RuleGroup {
    return new RuleGroup([new ConstantValue(value) as RulePart]);
  }

  private static parsePointers(definitionPart: string, ruleMap: RuleMap): RuleGroup {
    const ruleParts = definitionPart.trim().split(' ').map(otherRuleNumber => {
      return new RulePointer(parseInt(otherRuleNumber), ruleMap) as RulePart;
    });
    return new RuleGroup(ruleParts);
  }

  private static parseDefinitionPart(definitionPart: string, ruleMap: RuleMap): RuleGroup {
    const constantValueMatch = definitionPart.match(/^"(\w)"$/);
    if (constantValueMatch) {
      return RuleParser.parseConstant(definitionPart[1]);
    }

    return RuleParser.parsePointers(definitionPart, ruleMap);
  }

  private static parseDefinition(definition: string, ruleMap: RuleMap): RuleGroup[] {
    return definition.split('|').map(definitionPart => RuleParser.parseDefinitionPart(definitionPart, ruleMap));

  }

  private static parseRule(ruleDefinition: string, ruleMap: RuleMap) {
    const parts = ruleDefinition.split(':');
    const ruleNumber = parseInt(parts[0]);
    const definition = parts[1].trim();

    const groups = RuleParser.parseDefinition(definition, ruleMap);

    const rule = new Rule(ruleNumber, groups);
    ruleMap[ruleNumber] = rule;
    return rule;
  }

  static parse(ruleDefinitions: string[]): RuleMap {
    const ruleMap = {} as RuleMap;
    ruleDefinitions.forEach(ruleDefinitions => RuleParser.parseRule(ruleDefinitions, ruleMap));
    return ruleMap;
  }
}

export class Solution extends GroupedFileInputChallenge {
  private filterToValidValues(ruleMap: RuleMap, images: string[]) {
    const rule = ruleMap[0];
    return images.filter(image => {
      const ruleMatches = rule.matches(image);
      return ruleMatches.some(characterCount => characterCount === image.length);
    });
  }

  private modifiedRuleDefition() {
    return this.groups[0].map(line => {
      switch (line) {
        case '8: 42':
          return '8: 42 | 42 8';
        case '11: 42 31':
          return '11: 42 31 | 42 11 31';
        default:
          return line;
      }
    });
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 19;
  }

  partOne(): void {
    const ruleMap = RuleParser.parse(this.groups[0]);
    const validImages = this.filterToValidValues(ruleMap, this.groups[1]);

    console.log(`There are ${validImages.length} valid images`);
  }

  partTwo(): void {
    const modifiedRules = this.modifiedRuleDefition();
    const ruleMap = RuleParser.parse(modifiedRules);
    const validImages = this.filterToValidValues(ruleMap, this.groups[1]);

    console.log(`There are ${validImages.length} valid images`);
  }
}
