using System.Text;

namespace AdventOfCode2022.Day10;

public class Solution : SolutionBase
{
  public override int Day => 10;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var operations = GetOperations();
    var circuit = new ClockCircuit();

    circuit.Run(operations);
    
    Console.WriteLine("At the end of the operations the sum of the samples is {0}", circuit.SampledSignalsSum);
  }

  protected override void PerformPart2()
  {
    var operations = GetOperations();
    var circuit = new ClockCircuit();

    circuit.Run(operations);

    circuit.Render();
  }

  private Queue<Operation> GetOperations()
  {
    return new Queue<Operation>(GetInput().Select(ParseLine));
  }

  private Operation ParseLine(string line)
  {
    var parts = line.Split(" ");
    switch (parts[0])
    {
      case "noop":
        return new NoopOperation();
      case "addx":
        return new AddOperation(Int32.Parse(parts[1]));
    }
    throw new Exception();
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }
}

public class ClockCircuit
{
  private const int SCREEN_WIDTH = 40;

  public int Register { get; private set; }

  public int CycleCount { get; private set; }

  private List<int> _sampledSignals = new List<int>();
  private Dictionary<Position, char> _pixels = new Dictionary<Position, char>();

  public int SampledSignalsSum
  {
    get { return _sampledSignals.Sum(); }
  }

  public ClockCircuit()
  {
    Register = 1;
  }

  public void Run(Queue<Operation> operations)
  {
    ResetScreen();

    var lastOperationCycle = CycleCount;
    var nextOperation = operations.Dequeue();

    var currentPixel = 0;
    while (nextOperation != null)
    {
      CycleCount += 1;

      DrawPixel(currentPixel);

      if ((CycleCount == 20) || ((CycleCount - 20) % 40 == 0))
      {
        _sampledSignals.Add(Register * CycleCount);
      }

      if ((CycleCount - lastOperationCycle) == nextOperation.CycleCount)
      {
        Register = nextOperation.Execute(Register);
        operations.TryDequeue(out nextOperation);
        lastOperationCycle = CycleCount;
      }

      currentPixel += 1;
    }
  }

  private void DrawPixel(int currentPixel)
  {
    var row = (currentPixel) / SCREEN_WIDTH;
    var column = (currentPixel) % SCREEN_WIDTH;

    var pixelPosition = new Position(column, row);

    var spriteRight = Register + 1;
    var spriteLeft = Register - 1;

    if (column >= spriteLeft && column <= spriteRight)
    {
      _pixels.Add(pixelPosition, '#');
    }
    else
    {
      _pixels.Add(pixelPosition, '.');
    }
  }

  private void ResetScreen()
  {
    _pixels.Clear();
  }

  public void Render()
  {
    var maximumY = _pixels.Keys.Max(position => position.Y);
    for (var y = 0; y <= maximumY; y += 1)
    {
      var line = new StringBuilder();
      for (var x = 0; x < SCREEN_WIDTH; x += 1)
      {
        var position = new Position(x, y);
        if (_pixels.ContainsKey(position))
          line.Append(_pixels[position]);
        else
          line.Append(' ');
      }
      Console.WriteLine(line.ToString());
    }
  }
}

public interface Operation
{
  public int CycleCount { get; }

  public int Execute(int currentRegister);
}

public class NoopOperation : Operation
{
  public int CycleCount => 1;

  public int Execute(int currentRegister)
  {
    return currentRegister;
  }
}
public class AddOperation : Operation
{
  public int CycleCount => 2;

  public int Value { get; private set; }

  public AddOperation(int value)
  {
    Value = value;
  }

  public int Execute(int currentRegister)
  {
    return currentRegister + Value;
  }
}

public record Position(int X, int Y);