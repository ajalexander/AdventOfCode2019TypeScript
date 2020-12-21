import { FileInputChallenge } from '../common/dayChallenge';

// const inputFile = 'example.txt';
const inputFile = 'problemInput.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface Food {
  ingredients: Set<string>;
  allergens: Set<string>;
}

interface ClassifiedIngredients {
  ingredientsToAllergens: Map<string, string>;
  safeIngredients: Set<string>;
}

class InputParser {
  static parse(lines: string[]): Food[] {
    return lines.map(line => {
      const ingredients = new Set(line.split('(')[0].trim().split(' '));
      const allergens = new Set(line.match(/\((.*)\)/)[1]
        .replace('contains ', '')
        .split(', '));

      return { ingredients, allergens } as Food;
    });
  }
}

export class Solution extends FileInputChallenge {
  private static findCommonIngredients(foods: Food[], exceptForIngredients: Set<string>) {
    const initialIngredients = [...foods[0].ingredients].filter(ingredient => !exceptForIngredients.has(ingredient));
    const commonIngredients = new Set(initialIngredients);

    foods.slice(1).forEach(otherFood => {
      commonIngredients.forEach(ingredient => {
        if (!otherFood.ingredients.has(ingredient)) {
          commonIngredients.delete(ingredient);
        }
      });
    });

    return commonIngredients;
  }

  private static matchAllergens(foods: Food[]) {
    const allergens = new Set(foods.map(food => [...food.allergens]).flat());
    const allergenCount = allergens.size;
    const matchedAllergens = new Set<string>();
    const matchedIngredients = new Set<string>();
    const ingredientsToAllergens = new Map<string, string>();

    while (matchedAllergens.size < allergenCount) {
      allergens.forEach(allergen => {
        const foodsWithAllergen = foods.filter(food => food.allergens.has(allergen));
        const commonIngredients = this.findCommonIngredients(foodsWithAllergen, matchedIngredients);

        if (commonIngredients.size === 1) {
          const ingredient = [...commonIngredients][0];

          matchedAllergens.add(allergen);
          matchedIngredients.add(ingredient);
          ingredientsToAllergens.set(ingredient, allergen);

          allergens.delete(allergen);
        }
      });
    }

    return ingredientsToAllergens;
  }

  private static classify(foods: Food[]): ClassifiedIngredients {
    const allIngredients = foods.flatMap(food => [...food.ingredients]);
    const ingredientsToAllergens = this.matchAllergens(foods);
    const safeIngredients = new Set(allIngredients.filter(ingredient => !ingredientsToAllergens.has(ingredient)));

    return {
      ingredientsToAllergens,
      safeIngredients,
    };
  }

  private static countUsesOfSafeIngredients(foods: Food[], safeIngredients: Set<string>) {
    return [...safeIngredients].reduce((acc, ingredient) => {
      const matchingFoods = foods.filter(food => food.ingredients.has(ingredient));
      return acc + matchingFoods.length;
    }, 0);
  }

  constructor() {
    super(inputPath);
  }

  dayNumber(): number {
    return 21;
  }

  partOne(): void {
    const foods = InputParser.parse(this.lines);
    const classified = Solution.classify(foods);
    const usesOfSafe = Solution.countUsesOfSafeIngredients(foods, classified.safeIngredients);

    console.log(`The possibly safe ingredents were used ${usesOfSafe} times`);
  }

  partTwo(): void {
    const foods = InputParser.parse(this.lines);
    const classified = Solution.classify(foods);

    const dangerousList = [...classified.ingredientsToAllergens]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(item => item[0])
      .join(',');

    console.log(`The dangerous ingredients are ${dangerousList}`);
  }
}
