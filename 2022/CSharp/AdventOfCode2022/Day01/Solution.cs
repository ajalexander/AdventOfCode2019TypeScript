namespace AdventOfCode2022.Day01;

public class Solution : SolutionBase
{
  public override int Day => 1;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var caloriesPerElf = SortedCaloriesPerElf();

    var maximumCalories = caloriesPerElf.First();

    Console.WriteLine("The maximum calories by a single elf are: {0}", maximumCalories);
  }

  protected override void PerformPart2()
  {
    var caloriesPerElf = SortedCaloriesPerElf();

    var caloriesFromTopThree = caloriesPerElf.Take(3).Sum();

    Console.WriteLine("The calories from the top three elves are: {0}", caloriesFromTopThree);
  }

  private List<int> SortedCaloriesPerElf()
  {
    var itemsPerElf = GetInput();
    var caloriesPerElf = itemsPerElf.Select(items => items.Sum(item => Int32.Parse(item)));

    return caloriesPerElf.OrderByDescending(calories => calories).ToList();
  }

  private List<List<string>> GetInput()
  {
    return ReadFileLineGroups(ExampleMode ? "example.txt" : "input.txt");
  }
}