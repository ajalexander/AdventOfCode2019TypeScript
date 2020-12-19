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
  readonly ruleParts: RulePart[][];

  constructor(ruleNumber: number, ruleParts: RulePart[][]) {
    this.ruleNumber = ruleNumber;
    this.ruleParts = ruleParts;
  }

  match(input: string, index = 0): RuleMatch {
    for (let partsIndex = 0; partsIndex < this.ruleParts.length; partsIndex += 1) {
      const rulePart = this.ruleParts[partsIndex];

      let matchedCharacters = 0;
      for (let partIndex = 0; partIndex < rulePart.length; partIndex += 1) {
        const partMatch = rulePart[partIndex].matches(input, index + matchedCharacters);
        if (partMatch.matched) {
          matchedCharacters += partMatch.charactersMatched;
        } else {
          break;
        }

        if (partIndex === rulePart.length - 1) {
          return {
            matched: true,
            charactersMatched: matchedCharacters
          }
        }
      }
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
  static parse(ruleDefinitions: string[]) {
    const ruleMap = {} as RuleMap;

    ruleDefinitions.forEach(ruleDefinition => {
      const parts = ruleDefinition.split(':');
      const ruleNumber = parseInt(parts[0]);
      const definition = parts[1].trim();

      const definitionParts = definition.split('|');
      const rulesParts: RulePart[][] = definitionParts.map(definitionPart => {
        const constantValueMatch = definitionPart.match(/^"(\w)"$/);
        if (constantValueMatch) {
          return [new ConstantValue(constantValueMatch[1]) as RulePart];
        }

        return definitionPart.trim().split(' ').map(otherRuleNumber => {
          return new RulePointer(parseInt(otherRuleNumber), ruleMap) as RulePart;
        });
      });

      const rule = new Rule(ruleNumber, rulesParts);
      ruleMap[ruleNumber] = rule;
    });

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
