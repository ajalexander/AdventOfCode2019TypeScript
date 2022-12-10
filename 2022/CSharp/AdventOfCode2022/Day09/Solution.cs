namespace AdventOfCode2022.Day09;

public class Solution : SolutionBase
{
  public override int Day => 9;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    Perform(2);
  }

  protected override void PerformPart2()
  {
    Perform(10);
  }

  private void Perform(int numberOfKnots)
  {
    var moves = GetMoves();
    var state = new PuzzleState(numberOfKnots);

    foreach (var move in moves)
    {
      state.Move(move);
    }

    Console.WriteLine("There are {0} positions the tail has visited at least once", state.VisitedTailPositions.Count());
  }

  private List<MoveOperation> GetMoves()
  {
    return GetInput().Select(line =>
    {
      var parts = line.Split(" ");
      return new MoveOperation(GetDirectionFromCode(parts[0]), Int32.Parse(parts[1]));
    })
    .ToList();
  }

  private Direction GetDirectionFromCode(string code)
  {
    switch (code)
    {
      case "U":
        return Direction.Up;
      case "D":
        return Direction.Down;
      case "L":
        return Direction.Left;
      case "R":
        return Direction.Right;
    }
    throw new Exception();
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }
}

public record MoveOperation(Direction Direction, int Quantity);

public enum Direction
{
  Up,
  Down,
  Left,
  Right,
}

public record Position(int X, int Y);

public class PuzzleState
{
  private readonly HashSet<Position> _visitedTailPositions = new HashSet<Position>();

  private List<Position> _knotPositions;

  public IEnumerable<Position> VisitedTailPositions
  {
    get { return _visitedTailPositions; }
  }

  public PuzzleState(int numberOfKnots)
  {
    _knotPositions = new List<Position>();
    for (var i = 0; i < numberOfKnots; i += 1)
    {
      _knotPositions.Add(new Position(0, 0));
    }

    _visitedTailPositions.Add(new Position(0, 0));
  }

  public void Move(MoveOperation moveOperation)
  {
    var shifts = GetShifts(moveOperation.Direction);
    for (int i = 0; i < moveOperation.Quantity; i += 1)
    {
      _knotPositions[0] = new Position(_knotPositions[0].X + shifts.X, _knotPositions[0].Y + shifts.Y);

      var previous = _knotPositions[0];

      for (var knotIndex = 1; knotIndex < _knotPositions.Count; knotIndex += 1)
      {
        MoveNextIfNecessary(knotIndex);
      }
    }
  }

  private void MoveNextIfNecessary(int currentIndex)
  {
    var previous = _knotPositions[currentIndex - 1];
    var current = _knotPositions[currentIndex];
    if (KnotTooFarAway(previous, current))
    {
      var xShift = previous.X == current.X ? 0 : previous.X > current.X ? 1 : -1;
      var yShift = previous.Y == current.Y ? 0 : previous.Y > current.Y ? 1 : -1;

      _knotPositions[currentIndex] = new Position(current.X + xShift, current.Y + yShift);
    }

    if ((currentIndex == (_knotPositions.Count - 1)) && (current != _knotPositions[currentIndex]))
    {
      _visitedTailPositions.Add(_knotPositions[currentIndex]);
    }
  }

  private bool KnotTooFarAway(Position one, Position two)
  {
    return (Math.Abs(one.X - two.X) > 1) || (Math.Abs(one.Y - two.Y) > 1); 
  }

  private DirectionalShift GetShifts(Direction direction)
  {
    switch (direction)
    {
      case Direction.Up:
        return new DirectionalShift(0, -1);
      case Direction.Down:
        return new DirectionalShift(0, 1);
      case Direction.Left:
        return new DirectionalShift(-1, 0);
      case Direction.Right:
        return new DirectionalShift(1, 0);
    }
    throw new Exception();
  }
}

public record DirectionalShift(int X, int Y);