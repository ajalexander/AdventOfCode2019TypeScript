using System;

var dayNumber = Int32.Parse(Args[0]);
var twoDigitDay = dayNumber.ToString("00");

var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "AdventOfCode2022", $"Day{twoDigitDay}");
if (Directory.Exists(directoryPath))
{
  Console.Error.WriteLine("The directory for day {0} already exists!", dayNumber);
  return;
}

Directory.CreateDirectory(directoryPath);

var solutionPath = Path.Combine(directoryPath, "Solution.cs");
var examplePath = Path.Combine(directoryPath, "example.txt");
var inputPath = Path.Combine(directoryPath, "input.txt");

using (File.Create(inputPath)) {}
using (File.Create(examplePath)) {}

var templateFile = Path.Combine(Directory.GetCurrentDirectory(), "Scripts", "template.txt");
var templateContents = File.ReadAllText(templateFile);

var solutionContents = templateContents
  .Replace("%DAY_NUMBER%", dayNumber.ToString())
  .Replace("%TWO_DAY_DISPLAY%", twoDigitDay);

File.WriteAllText(solutionPath, solutionContents);

Console.WriteLine("Created the scaffold solution for day {0}", dayNumber);
