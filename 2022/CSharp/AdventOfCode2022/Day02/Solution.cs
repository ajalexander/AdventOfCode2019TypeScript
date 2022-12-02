namespace AdventOfCode2022.Day02;

public class Solution : SolutionBase
{
  public override int Day => 2;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var rounds = GetStrategyGuidePartOne();
    Console.WriteLine("Your final score is {0}", FinalScore(rounds));
  }

  protected override void PerformPart2()
  {
    var rounds = GetStrategyGuidePartTwo();
    Console.WriteLine("Your final score is {0}", FinalScore(rounds));
  }

  private int FinalScore(List<RoundChoices> rounds)
  {
    return rounds
      .Select(round => ScoreRound(round))
      .Sum();
  }

  private List<RoundChoices> GetStrategyGuidePartOne()
  {
    return GetInput()
      .Select(line =>
      {
        var parts = line.Split(" ");
        return new RoundChoices(OpponentCodeToChoice(parts[0]), YourCodeToChoice(parts[1]));
      }).ToList();
  }

  private List<RoundChoices> GetStrategyGuidePartTwo()
  {
    return GetInput()
      .Select(line =>
      {
        var parts = line.Split(" ");
        var opponent = OpponentCodeToChoice(parts[0]);
        var necessaryResult = YourCodeToRoundResult(parts[1]);
        var you = DetermineYourChoice(opponent, necessaryResult);
        return new RoundChoices(opponent, you);
      }).ToList();
  }

  private int ScoreRound(RoundChoices round)
  {
    var selectionScore = (int) round.You;
    var resultScore = (int) CheckIfYouWin(round);
    
    return selectionScore + resultScore;
  }

  private RoundResult CheckIfYouWin(RoundChoices round)
  {
    if (round.Opponent == round.You)
    {
      return RoundResult.Draw;
    }

    switch (round.Opponent)
    {
      case Choice.Rock:
        if (round.You == Choice.Paper)
          return RoundResult.Win;
        return RoundResult.Lose;
      case Choice.Paper:
        if (round.You == Choice.Scissors)
          return RoundResult.Win;
        return RoundResult.Lose;
      case Choice.Scissors:
        if (round.You == Choice.Rock)
          return RoundResult.Win;
        return RoundResult.Lose;
      default:
        throw new Exception();
    }
  }

  private Choice OpponentCodeToChoice(string code)
  {
    switch (code)
    {
      case "A":
        return Choice.Rock;
      case "B":
        return Choice.Paper;
      case "C":
        return Choice.Scissors;
      default:
        throw new Exception();
    }
  }

  private Choice YourCodeToChoice(string code)
  {
    switch (code)
    {
      case "X":
        return Choice.Rock;
      case "Y":
        return Choice.Paper;
      case "Z":
        return Choice.Scissors;
      default:
        throw new Exception();
    }
  }

  private Choice DetermineYourChoice(Choice opponentChoice, RoundResult necessaryResult)
  {
    switch (necessaryResult)
    {
      case RoundResult.Draw:
        return opponentChoice;
      case RoundResult.Win:
        switch (opponentChoice)
        {
          case Choice.Rock:
            return Choice.Paper;
          case Choice.Paper:
            return Choice.Scissors;
          case Choice.Scissors:
            return Choice.Rock;
        }
        break;
      case RoundResult.Lose:
        switch (opponentChoice)
        {
          case Choice.Rock:
            return Choice.Scissors;
          case Choice.Paper:
            return Choice.Rock;
          case Choice.Scissors:
            return Choice.Paper;
        }
        break;
    }

    throw new Exception();
  }

  private RoundResult YourCodeToRoundResult(string code)
  {
    switch (code)
    {
      case "X":
        return RoundResult.Lose;
      case "Y":
        return RoundResult.Draw;
      case "Z":
        return RoundResult.Win;
      default:
        throw new Exception();
    }
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }
}

public enum RoundResult
{
  Win = 6,
  Lose = 0,
  Draw = 3
}

public enum Choice
{
  Rock = 1,
  Paper = 2,
  Scissors = 3
}

public record RoundChoices(Choice Opponent, Choice You);