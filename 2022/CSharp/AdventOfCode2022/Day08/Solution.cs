namespace AdventOfCode2022.Day08;

public class Solution : SolutionBase
{
  public override int Day => 8;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var grid = GetTreeGrid();
    var visiblePoints = grid.TreePositions.Where(p => grid.IsVisible(p));

    Console.WriteLine("There are {0} trees visible from outside the grid", visiblePoints.Count());
  }

  protected override void PerformPart2()
  {
    var grid = GetTreeGrid();
    var mostScenic = grid.TreePositions.Max(p => grid.CalculatedScenicScore(p));

    Console.WriteLine("The most scenic tree scores a {0}", mostScenic);
  }

  private TreeGrid GetTreeGrid()
  {
    var grid = new TreeGrid();
  
    var input = GetInput();
    for (var y = 0; y < input.Count; y += 1)
    {
      for (var x = 0; x < input[y].Length; x += 1)
      {
        grid.AddTree(new Position(x, y), (int) Char.GetNumericValue(input[y][x]));
      }
    }

    return grid;
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }
}

public class TreeGrid
{
  private readonly Dictionary<Position, int> _treeHeights;

  public IEnumerable<Position> TreePositions
  {
    get { return _treeHeights.Keys; }
  }

  public TreeGrid()
  {
    _treeHeights = new Dictionary<Position, int>();
  }

  public void AddTree(Position position, int height)
  {
    _treeHeights.Add(position, height);
  }

  public bool IsEdge(Position position)
  {
    return position.X == TreePositions.Min(p => p.X)
      || position.X == TreePositions.Max(p => p.X)
      || position.Y == TreePositions.Min(p => p.Y)
      || position.Y == TreePositions.Max(p => p.Y);
  }

  public bool IsVisible(Position position)
  {
    if (IsEdge(position))
    {
      return true;
    }

    return !(HiddenInDirection(position, p => p.X == position.X && p.Y < position.Y)
      && HiddenInDirection(position, p => p.X == position.X && p.Y > position.Y)
      && HiddenInDirection(position, p => p.X < position.X && p.Y == position.Y)
      && HiddenInDirection(position, p => p.X > position.X && p.Y == position.Y));
  }

  private bool HiddenInDirection(Position position, Func<Position, bool> selector)
  {
    var positionsToCheck = TreePositions.Where(selector);
    var hidden = positionsToCheck.Any(p => GetHeight(p) >= GetHeight(position));
    return hidden;
  }

  public int CalculatedScenicScore(Position position)
  {
    var scores = new List<int>();

    scores.Add(TreesVisibleInVector(position, p => p.X == position.X && p.Y < position.Y, c => c.OrderByDescending(p => p.Y)));
    scores.Add(TreesVisibleInVector(position, p => p.X == position.X && p.Y > position.Y, c => c.OrderBy(p => p.Y)));
    scores.Add(TreesVisibleInVector(position, p => p.X < position.X && p.Y == position.Y, c => c.OrderByDescending(p => p.X)));
    scores.Add(TreesVisibleInVector(position, p => p.X > position.X && p.Y == position.Y, c => c.OrderBy(p => p.Y)));

    var sum = 1;
    foreach (var score in scores)
    {
      sum *= score;
    }

    return sum;
  }

  private int TreesVisibleInVector(Position position, Func<Position, bool> selector, Func<IEnumerable<Position>, IOrderedEnumerable<Position>> orderFunction)
  {
    var positionsInVector = TreesInVector(position, selector, orderFunction);
    var count = 0;
    foreach (var other in positionsInVector)
    {
      count += 1;
      if (GetHeight(other) >= GetHeight(position))
      {
        break;
      }
    }

    return count;
  }

  private IEnumerable<Position> TreesInVector(Position position, Func<Position, bool> selector, Func<IEnumerable<Position>, IOrderedEnumerable<Position>> orderFunction)
  {
    var positionsInLine = TreePositions.Where(selector).OrderBy(p => p.X);
    var ordered = orderFunction(positionsInLine);
    return ordered;
  }

  private int GetHeight(Position position)
  {
    return _treeHeights[position];
  }

  public IEnumerable<Position> LineOfSight(Position position)
  {
    return TreePositions.Where(p => p.X == position.X || p.Y == position.Y);
  }
}

public record Position(int X, int Y);