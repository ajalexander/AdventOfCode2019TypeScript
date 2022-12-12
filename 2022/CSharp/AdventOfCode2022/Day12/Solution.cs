namespace AdventOfCode2022.Day12;

public class Solution : SolutionBase
{
  public override int Day => 12;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var map = GetMap();
    var pathLength = map.DeterminePathLength();

    Console.WriteLine("It will take {0} steps to reach the end point", pathLength);
  }

  protected override void PerformPart2()
  {
  }

  private Map GetMap()
  {
    var input = GetInput();

    var height = input.Count;
    var width = input[0].Length;

    var starting = new Position(-1, -1);
    var ending = new Position(-1, -1);

    List<Location> locations = new List<Location>();

    for (var y = 0; y < height; y += 1)
    {
      for (var x = 0; x < width; x += 1)
      {
        var code = input[y][x];

        var isStart = (code == 'S');
        var isEnd = (code == 'E');

        var codeForHeight = isStart ? 'a' : isEnd ? 'z' : code;

        var heightValue = (int) codeForHeight - 96;

        var position = new Position(x ,y);
        locations.Add(new Location(position, heightValue));

        if (isStart)
          starting = position;
        else if (isEnd)
          ending = position;
      }
    }

    return new Map(starting, ending, locations);
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }
}

public class Map
{
  public Position Starting { get; private set; }

  public Position Ending { get; private set; }

  public List<Location> Locations {get; private set; }

  public int MaximumX { get; private set; }

  public int MaximumY { get; private set; }

  private Dictionary<Position, Location> _byPosition;
  
  public Map(Position starting, Position ending,  List<Location> locations)
  {
    Starting = starting;
    Ending = ending;
    Locations = locations;

    MaximumX = locations.Max(location => location.Position.X);
    MaximumY = locations.Max(location => location.Position.Y);

    _byPosition = locations.ToDictionary(location => location.Position, location => location);
  }

  public int DeterminePathLength()
  {
    var costs = _byPosition.Keys.ToDictionary(position => position, _ => int.MaxValue);
    costs[Starting] = 0;

    var queue = new Queue<Position>(new [] { Starting });

    while (queue.Count > 0)
    {
      var current = queue.Dequeue();

      var toEvaluate = GetReachablePositions(current).ToList();
      foreach (var other in toEvaluate)
      {
        var cost = costs[current] + 1;
        if (costs[other] > cost)
        {
          costs[other] = cost;
          queue.Enqueue(other);
        }
      }
    }

    return costs[Ending];
  }

  private IEnumerable<Position> GetReachablePositions(Position position)
  {
    return GetAdjacentPositions(position)
      .Where(other => CanTraverse(position, other));
  }

  private bool CanTraverse(Position current, Position testing)
  {
    return _byPosition[testing].HeightValue <= (_byPosition[current].HeightValue + 1);
  }

  private IEnumerable<Position> GetAdjacentPositions(Position position)
  {
    return GetPossiblePositions(position)
      .Where(other => _byPosition.ContainsKey(other));
  }

  private IEnumerable<Position> GetPossiblePositions(Position position)
  {
    yield return new Position(position.X - 1, position.Y);
    yield return new Position(position.X + 1, position.Y);
    yield return new Position(position.X, position.Y - 1);
    yield return new Position(position.X, position.Y + 1);
  }
}

public record Position(int X, int Y);

public record Location(Position Position, int HeightValue);