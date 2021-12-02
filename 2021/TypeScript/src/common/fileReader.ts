import { readFileSync } from "fs"

export const readInputFile = (path: string) => {
    return readFileSync(path).toString().split('\n');
}
