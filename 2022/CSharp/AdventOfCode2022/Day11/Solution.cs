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
    TakeTurns(monkeys, 20, 3);

    var mostActiveMonkeys = monkeys.OrderByDescending(monkey => monkey.InspectionCount).Take(2).ToList();
    var monkeyBusiness = mostActiveMonkeys[0].InspectionCount * mostActiveMonkeys[1].InspectionCount;

    Console.WriteLine("The monkey business score is {0}", monkeyBusiness);
  }

  protected override void PerformPart2()
  {
    var monkeys = GetMonkeys();
    TakeTurns(monkeys, 10000, 1);

    var mostActiveMonkeys = monkeys.OrderByDescending(monkey => monkey.InspectionCount).Take(2).ToList();
    var monkeyBusiness = mostActiveMonkeys[0].InspectionCount * mostActiveMonkeys[1].InspectionCount;

    Console.WriteLine("The monkey business score is {0}", monkeyBusiness);
  }

  private void TakeTurns(List<Monkey> monkeys, int turnCount, int worryReductionDivisor)
  {
    // Given the test divisors are all primes, a simple product will be the same value as a more complicated
    // LCM / GCD calculation
    var commonMultiplier = monkeys.Aggregate(1, (value, monkey) => value * monkey.TestDivisor);

    for (var i = 0; i < turnCount; i += 1)
    {
      foreach (var monkey in monkeys)
      {
        monkey.TakeTurn(worryReductionDivisor, commonMultiplier);
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

    var trueMonkeyId = int.Parse(Regex.Match(definition[4], "If true: throw to monkey (\\d+)").Groups[1].Value);
    var falseMonkeyId = int.Parse(Regex.Match(definition[5], "If false: throw to monkey (\\d+)").Groups[1].Value);

    monkey.SetupTest(monkeyMap[trueMonkeyId], monkeyMap[falseMonkeyId]);
  }

  private Monkey GetMonkey(List<string> definition)
  {
    var monkeyId = Int32.Parse(Regex.Match(definition[0], "Monkey (\\d+)").Groups[1].Value);

    var startingItems = Regex.Match(definition[1], "Starting items: (.+)").Groups[1].Value;
    var parsedItems = startingItems.Replace(" ", "").Split(",").Select(item => long.Parse(item));

    var worryFunction = GetWorryFunction(definition[2]);

    var testDivisor = int.Parse(Regex.Match(definition[3], "Test: divisible by (\\d+)").Groups[1].Value);

    var monkey = new Monkey(monkeyId, worryFunction, testDivisor);

    foreach (var item in parsedItems)
    {
      monkey.Items.Enqueue(item);
    }

    return monkey;
  }

  private Func<long, long> GetWorryFunction(string definitionLine)
  {
    var operationMatch = Regex.Match(definitionLine, "Operation: new = (.+) (.) (.+)");
    var operatorSymbol = operationMatch.Groups[2].Value;
    var left = operationMatch.Groups[1].Value;
    var right = operationMatch.Groups[3].Value;

    Func<long, long> leftValue = (long old) => (left == "old") ? old : int.Parse(left);
    Func<long, long> rightValue = (long old) => (right == "old") ? old : int.Parse(right);

    switch (operatorSymbol)
    {
      case "+":
        return (long value) => leftValue(value) + rightValue(value);
      case "*":
        return (long value) => leftValue(value) * rightValue(value);
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

  public Queue<long> Items { get; private set; }

  public Func<long, long> WorryOperation { get; private set; }

  public long InspectionCount { get; private set; }

  public int TestDivisor { get; private set; }

  private Func<long, Monkey> _testAndThrow = (long _) => { throw new Exception(); };

  public Monkey(int id, Func<long, long> worryOperation, int testDivisor)
  {
    Id = id;
    WorryOperation = worryOperation;
    TestDivisor = testDivisor;

    Items = new Queue<long>();
  }

  public void SetupTest(Monkey ifTrue, Monkey ifFalse)
  {
    _testAndThrow = (long item) => ((item % TestDivisor) == 0) ? ifTrue : ifFalse;
  }

  public void TakeTurn(int worryReductionDivisor, int commonMultiplier)
  {
    while (Items.Count > 0)
    {
      InspectionCount += 1;

      var item = Items.Dequeue();
      var newLevel = WorryOperation(item);
      var reduced = (newLevel / worryReductionDivisor) % commonMultiplier;

      var targetMonkey = _testAndThrow(reduced);
      targetMonkey.Items.Enqueue(reduced);
    }
  }
}