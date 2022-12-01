namespace AdventOfCode2022.Day01;

public class Solution : SolutionBase
{
  public override int Day => 1;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var itemsPerElf = GetInput();
    var caloriesPerElf = itemsPerElf.Select(items => items.Sum(item => Int32.Parse(item))).ToList();
    caloriesPerElf.Sort();

    var maximumCalories = caloriesPerElf.Last();

    Console.WriteLine("The maximum calories by a single elf are: {0}", maximumCalories);
  }

  protected override void PerformPart2()
  {
  }

  private List<List<string>> GetInput()
  {
    return ReadFileLineGroups(ExampleMode ? "example.txt" : "input.txt");
  }
}