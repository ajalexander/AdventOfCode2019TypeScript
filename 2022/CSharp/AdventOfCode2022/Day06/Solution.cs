namespace AdventOfCode2022.Day06;

public class Solution : SolutionBase
{
  public override int Day => 6;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    GetInput()
      .ForEach(input => {
        var markerPosition = LocateBufferMarker(input);
        Console.WriteLine("The buffer marker is at {0}", markerPosition);
      });
  }

  protected override void PerformPart2()
  {
  }

  private int LocateBufferMarker(string input)
  {
    var currentValues = input.Substring(0, 4).ToList();
    var counter = 4;
    while (!ContainsUniqueValues(currentValues))
    {
      counter += 1;
      currentValues.RemoveAt(0);
      currentValues.Add(input.Substring(counter - 1, 1).ToCharArray().Single());
    }

    return counter;
  }

  private bool ContainsUniqueValues(List<char> input)
  {
    return input.Count == input.Distinct().Count();
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }
}