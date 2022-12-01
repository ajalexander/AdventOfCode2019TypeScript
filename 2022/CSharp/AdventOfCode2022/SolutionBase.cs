using System.Diagnostics;

namespace AdventOfCode2022;

public abstract class SolutionBase
{
  public abstract int Day { get; }

  public bool ExampleMode { get; private set; }

  protected SolutionBase(bool exampleMode)
  {
    ExampleMode = exampleMode;
  }

  public void Run()
  {
    Console.WriteLine("Running solution for day {0}{1}...", Day, ExampleMode ? " in example mode" : "");
    Console.WriteLine();

    var stopwatch = new Stopwatch();
    stopwatch.Start();

    RunPart(1, PerformPart1);
    RunPart(2, PerformPart2);

    stopwatch.Stop();

    Console.WriteLine("Finished day {0} ({1}ms elapsed)", Day, stopwatch.ElapsedMilliseconds);
  }

  private void RunPart(int partNumber, Action partFunction)
  {
    Console.WriteLine("Starting part {0}...", partNumber);
    Console.WriteLine();

    var stopwatch = new Stopwatch();

    stopwatch.Start();
    partFunction();
    stopwatch.Stop();

    Console.WriteLine();
    Console.WriteLine("Finished part {0} ({1}ms elapsed)", partNumber, stopwatch.ElapsedMilliseconds);
    Console.WriteLine();
  }

  protected abstract void PerformPart1();

  protected abstract void PerformPart2();

  protected string ReadFileContent(string filename)
  {
    var fullPath = Path.Combine(Environment.CurrentDirectory, $"Day{Day.ToString("00")}", filename);
    using (var reader = new System.IO.StreamReader(fullPath))
      return reader.ReadToEnd();
  }

  protected List<string> ReadFileLines(string filename)
  {
    return ReadFileContent(filename).Split(Environment.NewLine).ToList();
  }

  protected List<List<string>> ReadFileLineGroups(string filename)
  {
    var lines = ReadFileLines(filename);

    var current = new List<string>();
    var groups = new List<List<string>> { current };

    lines.ForEach(line =>
    {
      if (string.IsNullOrEmpty(line))
      {
        current = new List<string>();
        groups.Add(current);
      }
      else
      {
        current.Add(line);
      }
    });

    return groups.Where(group => group.Count > 0).ToList();
  }
}