import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example1.txt';
// const inputFile = 'example2.txt';
// const inputFile = 'example3.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

enum NodeType {
    start,
    end,
    bigCave,
    smallCave
}

class Node {
    readonly type: NodeType;
    readonly key: string;
    readonly connected: Set<Node>;

    constructor(key: string) {
        this.type = Node.determineType(key);
        this.key = key;
        this.connected = new Set<Node>();
    }

    addConnection(other: Node) {
        this.connected.add(other);
    }

    private static determineType(key: string): NodeType {
        if (key === 'start') {
            return NodeType.start;
        }
        if (key === 'end') {
            return NodeType.end;
        }
        if (key.match(/^[A-Z]+$/)) {
            return NodeType.bigCave;
        }
        return NodeType.smallCave;
    }
}

class CaveSystem {
    readonly nodes: Node[];
    readonly map: Map<string, Node>;

    constructor() {
        this.nodes = [];
        this.map = new Map<string, Node>();
    }

    addConnection(left: string, right: string) {
        const leftNode = this.getNode(left) as Node;
        const rightNode = this.getNode(right) as Node;

        leftNode?.addConnection(rightNode);
        rightNode?.addConnection(leftNode);
    } 

    findPaths(allowSecondVisit = false) {
        return this.nodes.filter(node => node.type === NodeType.start).flatMap(starting => this.findPathsFromNode(starting, allowSecondVisit));
    }

    private findPathsFromNode(node: Node, allowSecondVisit: boolean) {
        return this.walkTree(node, [], allowSecondVisit);
    }

    private walkTree(node: Node, steps: Node[], allowSecondVisit: boolean) {
        const paths: Node[][] = [];
        node.connected.forEach(connected => {
            const nextSteps = steps.slice();
            if (connected.type === NodeType.end) {
                nextSteps.push(connected);
                paths.push(nextSteps);
            }
            else if (connected.type === NodeType.bigCave) {
                nextSteps.push(connected);
                this.walkTree(connected, nextSteps, allowSecondVisit).forEach(path => paths.push(path));
            }
            else if (connected.type === NodeType.smallCave) {
                if (steps.includes(connected)) {
                    if (allowSecondVisit) {
                        nextSteps.push(connected);
                        this.walkTree(connected, nextSteps, false).forEach(path => paths.push(path));
                    }
                } else {
                    nextSteps.push(connected);
                    this.walkTree(connected, nextSteps, allowSecondVisit).forEach(path => paths.push(path));
                }
            }
        });
        return paths;
    }

    private getNode(key: string) {
        if (!this.map.has(key)) {
            const node = new Node(key);
            this.nodes.push(node);
            this.map.set(key, node);
        }

        return this.map.get(key);
    }
}

const parseInputs = (inputLines: string[]) => {
    const system = new CaveSystem();

    inputLines.forEach(line => {
        const [left, right] = line.split('-');
        system.addConnection(left, right);
    });

    return system;
};


export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 12;
    }

    partOne(): void {
        const system = parseInputs(this.inputLines);
        const paths = system.findPaths();

        console.log(`There are ${paths.length} paths through the cave system`);
    }

    partTwo(): void {
        const system = parseInputs(this.inputLines);
        const paths = system.findPaths(true);

        console.log(`There are ${paths.length} paths through the cave system`);
    }
}
