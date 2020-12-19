import { GroupedFileInputChallenge } from "../common/dayChallenge";

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface RulePart {
  matches(input: string, index: number): RuleMatch;
}

class ConstantValue implements RulePart {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  matches(input: string, index: number): RuleMatch {
    if (input[index] === this.value) {
      return {
        matched: true,
        charactersMatched: 1,
      };
    }
    return { matched: false };
  }
}

class RuleGroup {
  readonly parts: RulePart[];

  constructor(parts: RulePart[]) {
    this.parts = parts;
  }

  match(input: string, index: number) {
    let matchedCharacters = 0;

    for (let partIndex = 0; partIndex < this.parts.length; partIndex += 1) {
      const partMatch = this.parts[partIndex].matches(input, index + matchedCharacters);
      if (partMatch.matched) {
        matchedCharacters += partMatch.charactersMatched;
      } else {
        return { matched: false };
      }
    }

    return {
      matched: true,
      charactersMatched: matchedCharacters
    };
  }
}

class RulePointer implements RulePart {
  readonly otherRule: number;
  private readonly ruleMap: RuleMap;

  constructor(otherRule: number, ruleMap: RuleMap) {
    this.otherRule = otherRule;
    this.ruleMap = ruleMap;
  }

  matches(input: string, index: number): RuleMatch {
    const otherRule = this.ruleMap[this.otherRule];
    return otherRule.match(input, index);
  }
}

class Rule {
  readonly ruleNumber: number;
  readonly groups: RuleGroup[];

  constructor(ruleNumber: number, groups: RuleGroup[]) {
    this.ruleNumber = ruleNumber;
    this.groups = groups;
  }

  match(input: string, index = 0): RuleMatch {
    const partMatches = this.groups.map(group => group.match(input, index));
    const successfulMatches = partMatches.filter(match => match.matched);
    if (successfulMatches.length > 0) {
      return successfulMatches[0];
    }
    return { matched: false };
  }
}

interface RuleMatch {
  matched: boolean;
  charactersMatched?: number;
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
      const ruleMatch = rule.match(image);
      return ruleMatch.matched && ruleMatch.charactersMatched === image.length;
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
  }
}
