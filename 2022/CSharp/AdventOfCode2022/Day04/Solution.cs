namespace AdventOfCode2022.Day04;

public class Solution : SolutionBase
{
  public override int Day => 4;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var assignments = GetAssignments();
    var overlapping = assignments.Where(assignment => FullyOverlappingAssignment(assignment));

    Console.WriteLine("There are {0} overlapping assignments", overlapping.Count());
  }

  protected override void PerformPart2()
  {
    var assignments = GetAssignments();
    var overlapping = assignments.Where(assignment => PartiallyOverlappingAssignment(assignment));

    Console.WriteLine("There are {0} overlapping assignments", overlapping.Count());
  }

  private bool FullyOverlappingAssignment(PairAssignments assignments)
  {
    if (assignments.First.Beginning < assignments.Second.Beginning && assignments.First.End < assignments.Second.End)
    {
      return false;
    }
    if (assignments.First.Beginning > assignments.Second.Beginning && assignments.First.End > assignments.Second.End)
    {
      return false;
    }

    return true;
  }

  private bool PartiallyOverlappingAssignment(PairAssignments assignments)
  {
    if (assignments.First.Beginning <= assignments.Second.Beginning)
    {
      if (assignments.First.End < assignments.Second.Beginning)
      {
        return false;
      }

      return true;
    }
    
    if (assignments.Second.End < assignments.First.Beginning)
    {
      return false;
    }

    return true;
  }

  private List<PairAssignments> GetAssignments()
  {
    return GetInput()
      .Select(pair =>
      {
        var assignments = pair.Split(",");
        return new PairAssignments(GetAssignment(assignments[0]), GetAssignment(assignments[1]));
      })
      .ToList();
  }

  private AssignmentRange GetAssignment(string value)
  {
    var values = value.Split("-");
    return new AssignmentRange(Int32.Parse(values[0]), Int32.Parse(values[1]));
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }
}

public record PairAssignments(AssignmentRange First, AssignmentRange Second);

public record AssignmentRange(int Beginning, int End);