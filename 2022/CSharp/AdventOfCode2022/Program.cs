using AdventOfCode2022;

var arguments = Environment.GetCommandLineArgs();
var dayNumber = Int32.Parse(arguments[1]);

var twoDigitDay = dayNumber.ToString("00");

var typeName = $"AdventOfCode2022.Day{twoDigitDay}.Solution";

var assemby = System.Reflection.Assembly.GetExecutingAssembly();
if (assemby == null)
{
  Console.Error.WriteLine("Failed to get the assembly");
  return;
}
else
{
  var solutionType = assemby.GetType(typeName);
  if (solutionType == null)
  {
    Console.Error.WriteLine("Failed to find the solution type");
    return;
  }

  dynamic? solution = Activator.CreateInstance(solutionType) as SolutionBase;
  if (solution == null)
  {
    Console.Error.WriteLine("Failed to instantiate solution");
    return;
  }

  solution.Run();
}
