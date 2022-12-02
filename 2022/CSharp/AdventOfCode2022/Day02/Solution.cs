namespace AdventOfCode2022.Day02;

public class Solution : SolutionBase
{
  public override int Day => 2;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    Console.WriteLine("Your final score is {0}", FinalScore());
  }

  protected override void PerformPart2()
  {
  }

  private int FinalScore()
  {
    return GetStrategyGuide()
      .Select(round => ScoreRound(round))
      .Sum();
  }

  private List<RoundChoices> GetStrategyGuide()
  {
    return GetInput()
      .Select(line =>
      {
        var parts = line.Split(" ");
        return new RoundChoices(CodeToChoice(parts[0]), CodeToChoice(parts[1]));
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

  private Choice CodeToChoice(string code)
  {
    switch (code)
    {
      case "A":
      case "X":
        return Choice.Rock;
      case "B":
      case "Y":
        return Choice.Paper;
      case "C":
      case "Z":
        return Choice.Scissors;
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