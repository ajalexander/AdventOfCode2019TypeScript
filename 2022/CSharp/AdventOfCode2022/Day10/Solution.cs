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
  public int Register { get; private set; }

  public int CycleCount { get; private set; }

  public List<int> SampledSignals { get; private set; }

  public int SampledSignalsSum
  {
    get { return SampledSignals.Sum(); }
  }

  public ClockCircuit()
  {
    Register = 1;
    SampledSignals = new List<int>();
  }

  public void Run(Queue<Operation> operations)
  {
    var lastOperationCycle = CycleCount;
    var nextOperation = operations.Dequeue();

    while (nextOperation != null)
    {
      CycleCount += 1;

      if ((CycleCount == 20) || ((CycleCount - 20) % 40 == 0))
      {
        SampledSignals.Add(Register * CycleCount);
      }

      if ((CycleCount - lastOperationCycle) == nextOperation.CycleCount)
      {
        Register = nextOperation.Execute(Register);
        operations.TryDequeue(out nextOperation);
        lastOperationCycle = CycleCount;
      }
    }
  }

  public void RunOperation(Operation operation)
  {
    CycleCount += operation.CycleCount;
    Register = operation.Execute(Register);
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