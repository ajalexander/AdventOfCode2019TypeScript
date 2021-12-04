import { readFileSync } from "fs"

export const readInputFile = (path: string) => {
    return readFileSync(path).toString().split('\n');
}

export const readFileIntoLineGroups = (path: string) : string[][] => {
    const groups: string[][] = [];
    groups.push([]);

    readInputFile(path).forEach(line => {
      if (line.match(/^\s*$/)) {
        groups.push([]);
      } else {
        groups[groups.length - 1].push(line);
      }
    });

    return groups;
  }
