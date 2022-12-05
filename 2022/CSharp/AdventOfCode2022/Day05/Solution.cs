using System.Text.RegularExpressions;

namespace AdventOfCode2022.Day05;

public class Solution : SolutionBase
{
  public override int Day => 5;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    PerformPart(PerformMoveOperations9000);
  }

  protected override void PerformPart2()
  {
    PerformPart(PerformMoveOperations9001);
  }

  private void PerformPart(Action<Setup> moveOperationsFunction)
  {
    var setup = GetSetup();
    moveOperationsFunction(setup);

    var topOfStacks = setup.Locations.Values.Select(location => location.Contents.Peek());
    
    Console.WriteLine("The top of the stacks are: {0}", string.Join(" ", topOfStacks));
  }

  private void PerformMoveOperations9000(Setup setup)
  {
    foreach (var moveOperation in setup.Operations)
    {
      for (int i = 0; i < moveOperation.Quantity; i += 1)
      {
        setup.Locations[moveOperation.ToStack].Contents.Push(setup.Locations[moveOperation.FromStack].Contents.Pop());
      }
    }
  }

  private void PerformMoveOperations9001(Setup setup)
  {
    foreach (var moveOperation in setup.Operations)
    {
      var temporaryStack = new Stack<string>();
      for (int i = 0; i < moveOperation.Quantity; i += 1)
      {
        temporaryStack.Push(setup.Locations[moveOperation.FromStack].Contents.Pop());
      }

      foreach (var crate in temporaryStack)
      {
        setup.Locations[moveOperation.ToStack].Contents.Push(crate);
      }
    }
  }

  private Setup GetSetup()
  {
    var input = GetInput();
    var locations = GetLocations(input[0]);
    var moveOperations = GetOperations(input[1]);
    return new Setup(locations, moveOperations);
  }

  private Dictionary<int, Location> GetLocations(List<string> contents)
  {
    var locations = new List<Location>();
    var locationCount = contents[0].Length / 4 + 1;

    var map = new Dictionary<int, Location>();
    for (int locationIndex = 1; locationIndex <= locationCount; locationIndex += 1)
    {
      map.Add(locationIndex, new Location(locationIndex, new Stack<string>()));
    }

    for (int lineIndex = contents.Count - 2; lineIndex >= 0; lineIndex -= 1)
    {
      var line = contents[lineIndex];
      for (int locationIndex = 1; locationIndex <= locationCount; locationIndex += 1)
      {
        var crate = line.Substring((locationIndex - 1) * 4, 3);
        if (!string.IsNullOrWhiteSpace(crate))
        {
          map[locationIndex].Contents.Push(crate);
        }
      }
    }
    return map;
  }

  private List<MoveOperations> GetOperations(List<string> instructions)
  {
    var regex = new Regex("move (\\d+) from (\\d+) to (\\d+)");
    return instructions.Select(instruction =>
    {
      var match = regex.Match(instruction);
      return new MoveOperations(Int32.Parse(match.Groups[1].Value), Int32.Parse(match.Groups[2].Value), Int32.Parse(match.Groups[3].Value));
    })
    .ToList();
  }

  private List<List<string>> GetInput()
  {
    return ReadFileLineGroups(ExampleMode ? "example.txt" : "input.txt");
  }
}

public record Setup(Dictionary<int, Location> Locations, List<MoveOperations> Operations);

public record Location(int Identifier, Stack<string> Contents);

public record MoveOperations(int Quantity, int FromStack, int ToStack);