namespace AdventOfCode2022.Day07;

public class Solution : SolutionBase
{
  public override int Day => 7;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var root = GetDirectory();
    root.Print();

    var smallDirectories = root.FlattendSubdirectories.Where(sub => sub.Size <= 100000);
    var sizeSum = smallDirectories.Select(sub => sub.Size).Sum();

    Console.WriteLine("The sum of the size of small directories is {0}", sizeSum);
  }

  protected override void PerformPart2()
  {
  }

  private DeviceDirectory GetDirectory()
  {
    var input = GetInput();
    DeviceDirectory root = new DeviceDirectory("/");
    DeviceDirectory current = root;

    foreach (var line in input.Skip(1))
    {
      if (line.StartsWith("$ cd"))
      {
        var directoryName = line.Substring(5);
        if (directoryName == "..")
        {
          if (current == null || current.Parent == null)
          {
            throw new Exception();
          }

          current = current.Parent;
        }
        else
        {
          current = current.GetSubdirectory(directoryName);
        }
      }
      else if (line.StartsWith("$ ls"))
      {
      }
      else if (line.StartsWith("dir "))
      {
        var directoryName = line.Substring(4);
        current.Subdirectories.Add(new DeviceDirectory(directoryName, current));
      }
      else
      {
        var parts = line.Split(" ");
        current.Files.Add(new DeviceFile(parts[1], long.Parse(parts[0])));
      }
    }

    return root;
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }
}

public class DeviceFile
{
  public string Name { get; private set; }

  public long Size { get; private set; }

  public DeviceFile(string name, long size)
  {
    Name = name;
    Size = size;
  }
  public void Print(int leftPad)
  {
    Console.WriteLine($"{new String(' ', leftPad)}- {Name} (file, size={Size})");
  }
}

public class DeviceDirectory
{
  public string Name { get; private set; }

  public DeviceDirectory? Parent { get; private set; }

  public List<DeviceDirectory> Subdirectories { get; private set; }

  public List<DeviceFile> Files { get; private set; }

  public long Size
  {
    get
    {
      return Subdirectories.Select(sub => sub.Size).Sum() + Files.Select(file => file.Size).Sum();
    }
  }

  public IEnumerable<DeviceDirectory> FlattendSubdirectories
  {
    get
    {
      return Subdirectories.Concat(Subdirectories.SelectMany(sub => sub.FlattendSubdirectories));
    }
  }

  public DeviceDirectory(string name, DeviceDirectory? parent = null)
  {
    Name = name;
    Parent = parent;
    Subdirectories = new List<DeviceDirectory>();
    Files = new List<DeviceFile>();
  }

  public DeviceDirectory GetSubdirectory(string name)
  {
    return Subdirectories.Single(sub => sub.Name == name);
  }

  public void Print(int leftPad = 0)
  {
    Console.WriteLine($"{new String(' ', leftPad)}- {Name} (dir)");

    foreach (var sub in Subdirectories.OrderBy(sub => sub.Name))
    {
      sub.Print(leftPad + 3);
    }

    foreach (var file in Files.OrderBy(file => file.Name))
    {
      file.Print(leftPad + 3);
    }
  }
}
