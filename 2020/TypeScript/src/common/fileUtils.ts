import { readFileSync } from 'fs';

export class FileReader {
  readFile(path: string) : string[] {
    // console.log(`Reading lines from '${path}'`);
    return readFileSync(path).toString().split('\n');
  }

  readFileIntoLineGroups(path: string) : string[][] {
    const groups = [];
    groups.push([]);

    this.readFile(path).forEach(line => {
      if (line.match(/^\s*$/)) {
        groups.push([]);
      } else {
        groups[groups.length - 1].push(line);
      }
    });

    return groups;
  }
}
