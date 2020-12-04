import { readFileSync } from 'fs';

export class FileReader {
  readFile(path: string) : string[] {
    return readFileSync(path).toString().split('\n');
  }
}
