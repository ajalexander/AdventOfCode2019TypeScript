using System.Numerics;
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
    TakeTurns(monkeys, 10000, 1, true);

    var mostActiveMonkeys = monkeys.OrderByDescending(monkey => monkey.InspectionCount).Take(2).ToList();
    var monkeyBusiness = mostActiveMonkeys[0].InspectionCount * mostActiveMonkeys[1].InspectionCount;

    Console.WriteLine("The monkey business score is {0}", monkeyBusiness);
  }

  private void TakeTurns(List<Monkey> monkeys, int turnCount, int worryReductionDivisor, bool reportProgress = false)
  {
    for (var i = 0; i < turnCount; i += 1)
    {
      foreach (var monkey in monkeys)
      {
        monkey.TakeTurn(worryReductionDivisor);
      }

      if (reportProgress && (i > 0) && (i % (turnCount / 100)) == 0)
      {
        Console.WriteLine("Finished {0} turns", i);
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

    var testDivisor = int.Parse(Regex.Match(definition[3], "Test: divisible by (\\d+)").Groups[1].Value);
    var trueMonkeyId = int.Parse(Regex.Match(definition[4], "If true: throw to monkey (\\d+)").Groups[1].Value);
    var falseMonkeyId = int.Parse(Regex.Match(definition[5], "If false: throw to monkey (\\d+)").Groups[1].Value);

    monkey.SetupTest(testDivisor, monkeyMap[trueMonkeyId], monkeyMap[falseMonkeyId]);
  }

  private Monkey GetMonkey(List<string> definition)
  {
    var monkeyId = Int32.Parse(Regex.Match(definition[0], "Monkey (\\d+)").Groups[1].Value);

    var startingItems = Regex.Match(definition[1], "Starting items: (.+)").Groups[1].Value;
    var parsedItems = startingItems.Replace(" ", "").Split(",").Select(item => ulong.Parse(item));

    var worryFunction = GetWorryFunction(definition[2]);

    var monkey = new Monkey(monkeyId, worryFunction);

    foreach (var item in parsedItems)
    {
      monkey.Items.Enqueue(item);
    }

    return monkey;
  }

  private Func<BigInteger, BigInteger> GetWorryFunction(string definitionLine)
  {
    var operationMatch = Regex.Match(definitionLine, "Operation: new = (.+) (.) (.+)");
    var operatorSymbol = operationMatch.Groups[2].Value;
    var left = operationMatch.Groups[1].Value;
    var right = operationMatch.Groups[3].Value;

    Func<BigInteger, BigInteger> leftValue = (BigInteger old) => (left == "old") ? old : BigInteger.Parse(left);
    Func<BigInteger, BigInteger> rightValue = (BigInteger old) => (right == "old") ? old : BigInteger.Parse(right);

    switch (operatorSymbol)
    {
      case "+":
        return (BigInteger value) => leftValue(value) + rightValue(value);
      case "*":
        return (BigInteger value) => leftValue(value) * rightValue(value);
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

  public Queue<BigInteger> Items { get; private set; }

  public Func<BigInteger, BigInteger> WorryOperation { get; private set; }

  public BigInteger InspectionCount { get; private set; }

  private Func<BigInteger, Monkey> _testAndThrow = (BigInteger _) => { throw new Exception(); };

  public Monkey(int id, Func<BigInteger, BigInteger> worryOperation)
  {
    Id = id;
    Items = new Queue<BigInteger>();
    WorryOperation = worryOperation;
  }

  public void SetupTest(int testDivisor, Monkey ifTrue, Monkey ifFalse)
  {
    _testAndThrow = (BigInteger item) => ((item % testDivisor) == 0) ? ifTrue : ifFalse;
  }

  public void TakeTurn(int worryReductionDivisor)
  {
    while (Items.Count > 0)
    {
      InspectionCount += 1;

      var item = Items.Dequeue();
      var newLevel = WorryOperation(item);
      var reduced = newLevel / (uint) worryReductionDivisor;

      var targetMonkey = _testAndThrow(reduced);
      targetMonkey.Items.Enqueue(reduced);
    }
  }
}