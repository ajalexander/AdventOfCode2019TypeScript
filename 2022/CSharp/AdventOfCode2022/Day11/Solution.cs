using System.Text.RegularExpressions;

namespace AdventOfCode2022.Day11;

public class Solution : SolutionBase
{
  public override int Day => 11;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var monkeys = GetMonkeys();
    TakeTurns(monkeys, 20);

    var mostActiveMonkeys = monkeys.OrderByDescending(monkey => monkey.InspectionCount).Take(2).ToList();
    var monkeyBusiness = mostActiveMonkeys[0].InspectionCount * mostActiveMonkeys[1].InspectionCount;

    Console.WriteLine("The monkey business score is {0}", monkeyBusiness);
  }

  protected override void PerformPart2()
  {
  }

  private void TakeTurns(List<Monkey> monkeys, int turnCount)
  {
    for (var i = 0; i < turnCount; i += 1)
    {
      foreach (var monkey in monkeys)
      {
        monkey.TakeTurn();
      }
    }
  }

  private List<Monkey> GetMonkeys()
  {
    var definitions = GetInput();
    var monkeys = definitions.Select(definition => GetMonkey(definition)).ToList();

    SetupTests(definitions, monkeys);

    return monkeys;
  }

  private void SetupTests(List<List<string>> definitions, List<Monkey> monkeys)
  {
    var monkeyMap = monkeys.ToDictionary(monkey => monkey.Id, monkey => monkey);
    definitions.ForEach(definition => SetupTest(definition, monkeyMap));
  }

  private void SetupTest(List<string> definition, Dictionary<int, Monkey> monkeyMap)
  {
    var monkeyId = Int32.Parse(Regex.Match(definition[0], "Monkey (\\d+)").Groups[1].Value);

    var monkey = monkeyMap[monkeyId];

    var testDivisor = Int32.Parse(Regex.Match(definition[3], "Test: divisible by (\\d+)").Groups[1].Value);
    var trueMonkeyId = Int32.Parse(Regex.Match(definition[4], "If true: throw to monkey (\\d+)").Groups[1].Value);
    var falseMonkeyId = Int32.Parse(Regex.Match(definition[5], "If false: throw to monkey (\\d+)").Groups[1].Value);

    monkey.SetupTest(testDivisor, monkeyMap[trueMonkeyId], monkeyMap[falseMonkeyId]);
  }

  private Monkey GetMonkey(List<string> definition)
  {
    var monkeyId = Int32.Parse(Regex.Match(definition[0], "Monkey (\\d+)").Groups[1].Value);

    var startingItems = Regex.Match(definition[1], "Starting items: (.+)").Groups[1].Value;
    var parsedItems = startingItems.Replace(" ", "").Split(",").Select(item => Int32.Parse(item));

    var worryFunction = GetWorryFunction(definition[2]);

    var monkey = new Monkey(monkeyId, worryFunction);

    foreach (var item in parsedItems)
    {
      monkey.Items.Enqueue(item);
    }

    return monkey;
  }

  private Func<int, int> GetWorryFunction(string definitionLine)
  {
    var operationMatch = Regex.Match(definitionLine, "Operation: new = (.+) (.) (.+)");
    var operatorSymbol = operationMatch.Groups[2].Value;
    var left = operationMatch.Groups[1].Value;
    var right = operationMatch.Groups[3].Value;

    Func<int, int> leftValue = (int old) => (left == "old") ? old : Int32.Parse(left);
    Func<int, int> rightValue = (int old) => (right == "old") ? old : Int32.Parse(right);

    switch (operatorSymbol)
    {
      case "+":
        return (int value) => leftValue(value) + rightValue(value);
      case "*":
        return (int value) => leftValue(value) * rightValue(value);
    }

    throw new Exception();
  }

  private List<List<string>> GetInput()
  {
    return ReadFileLineGroups(ExampleMode ? "example.txt" : "input.txt");
  }
}

public class Monkey
{
  public int Id { get; private set; }

  public Queue<int> Items { get; private set; }

  public Func<int, int> WorryOperation { get; private set; }

  public int InspectionCount { get; private set; }

  private Func<int, Monkey> _testAndThrow = (int _) => { throw new Exception(); };

  public Monkey(int id, Func<int, int> worryOperation)
  {
    Id = id;
    Items = new Queue<int>();
    WorryOperation = worryOperation;
  }

  public void SetupTest(int testDivisor, Monkey ifTrue, Monkey ifFalse)
  {
    _testAndThrow = (int item) => ((item % testDivisor) == 0) ? ifTrue : ifFalse;
  }

  public void TakeTurn()
  {
    while (Items.Count > 0)
    {
      InspectionCount += 1;

      var item = Items.Dequeue();
      var newLevel = WorryOperation(item);
      var reduced = newLevel / 3;

      var targetMonkey = _testAndThrow(reduced);
      targetMonkey.Items.Enqueue(reduced);
    }
  }
}