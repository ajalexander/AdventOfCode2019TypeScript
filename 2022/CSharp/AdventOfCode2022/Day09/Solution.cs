namespace AdventOfCode2022.Day09;

public class Solution : SolutionBase
{
  public override int Day => 9;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var moves = GetMoves();
    var state = new PuzzleState();

    foreach (var move in moves)
    {
      state.Move(move);
    }

    Console.WriteLine("There are {0} positions the tail has visited at least once", state.VisitedTailPositions.Count());
  }

  protected override void PerformPart2()
  {
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
  private readonly Dictionary<Position, int> _tailVisitedCount = new Dictionary<Position, int>();

  public Position HeadPosition { get; private set; }
  public Position TailPosition { get; private set; }
  public IEnumerable<Position> VisitedTailPositions
  {
    get { return _tailVisitedCount.Keys; }
  }

  public PuzzleState()
  {
    HeadPosition = new Position(0, 0);
    TailPosition = new Position(0, 0);

    _tailVisitedCount.Add(TailPosition, 1);
  }

  public void Move(MoveOperation moveOperation)
  {
    var shifts = GetShifts(moveOperation.Direction);
    for (int i = 0; i < moveOperation.Quantity; i += 1) {
      HeadPosition = new Position(HeadPosition.X + shifts.X, HeadPosition.Y + shifts.Y);
      MoveTailIfNecessary(moveOperation.Direction);
    }
  }

  private void MoveTailIfNecessary(Direction direction)
  {
    if (TailTooFarAway())
    {
      switch (direction)
      {
        case Direction.Up:
          TailPosition = new Position(HeadPosition.X, HeadPosition.Y + 1);
          break;
        case Direction.Down:
          TailPosition = new Position(HeadPosition.X, HeadPosition.Y - 1);
          break;
        case Direction.Left:
          TailPosition = new Position(HeadPosition.X + 1, HeadPosition.Y);
          break;
        case Direction.Right:
          TailPosition = new Position(HeadPosition.X - 1, HeadPosition.Y);
          break;
      }

      if (_tailVisitedCount.ContainsKey(TailPosition))
      {
        _tailVisitedCount[TailPosition] = _tailVisitedCount[TailPosition] + 1;
      }
      else
      {
        _tailVisitedCount.Add(TailPosition, 1);
      }
    }
  }

  private bool TailTooFarAway()
  {
    return (Math.Abs(HeadPosition.X - TailPosition.X) > 1) || (Math.Abs(HeadPosition.Y - TailPosition.Y) > 1); 
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