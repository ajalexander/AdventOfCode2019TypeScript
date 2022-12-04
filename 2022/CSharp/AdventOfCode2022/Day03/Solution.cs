namespace AdventOfCode2022.Day03;

public class Solution : SolutionBase
{
  public override int Day => 3;

  private readonly Dictionary<char, int> _codeToScore;

  public Solution(bool exampleMode) : base(exampleMode)
  {
    _codeToScore = InitializeScoreMap();
  }

  protected override void PerformPart1()
  {
    var duplicatedItems = FindDuplicateItems();

    var priorityScore = duplicatedItems.Select(item => PriorityOfItem(item)).Sum();

    Console.WriteLine("The score of the priority items is {0}", priorityScore);
  }

  protected override void PerformPart2()
  {
    var badges = FindBadges();

    var badgeScore = badges.Select(item => PriorityOfItem(item)).Sum();

    Console.WriteLine("The score of the badges is {0}", badgeScore);
  }

  private Dictionary<char, int> InitializeScoreMap()
  {
    var codeToScore = new Dictionary<char, int>();

    for (int asciiCode = 65; asciiCode <= 90; asciiCode++)
    {
      codeToScore.Add(Convert.ToChar(asciiCode), asciiCode - 64 + 26);
    }

    for (int asciiCode = 97; asciiCode <= 122; asciiCode++)
    {
      codeToScore.Add(Convert.ToChar(asciiCode), asciiCode - 96);
    }

    return codeToScore;
  }

  private List<char> FindDuplicateItems()
  {
    return GetBackpackContents()
      .Select(contents =>
      {
        return contents.Top.ToArray().Intersect(contents.Bottom.ToArray()).Single();
      })
      .ToList();
  }

  private List<char> FindBadges()
  {
    return GetGroups()
      .Select(group =>
      {
        IEnumerable<char> currentPossibilities = group[0].ToArray();

        group.ForEach(item => currentPossibilities = currentPossibilities.Intersect(item.ToArray()));
        
        return currentPossibilities.Single();
      }).ToList();
  }

  private IEnumerable<List<string>> GetGroups()
  {
    var groupSize = 3;

    var individuals = GetInput();
    for (int i = 0; i < individuals.Count / groupSize; i ++)
    {
      yield return individuals.Skip(i * groupSize).Take(groupSize).ToList();
    }
  }

  private List<BackpackContents> GetBackpackContents()
  {
    return GetInput()
      .Select(values =>
      {
        var midpoint = values.Length / 2;

        var top = values.Substring(0, midpoint);
        var bottom = values.Substring(midpoint);

        return new BackpackContents(top, bottom);
      })
      .ToList();
  }

  private int PriorityOfItem(char code)
  {
    return _codeToScore[code];
  }

  private int GetAsciiCode(char code)
  {
    return unchecked(code & 0xff);
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }
}

public record BackpackContents(string Top, string Bottom);