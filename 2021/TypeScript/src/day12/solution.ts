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

    findPaths() {
        return this.nodes.filter(node => node.type === NodeType.start).flatMap(starting => this.findPathsFromNode(starting));
    }

    private findPathsFromNode(node: Node) {
        return this.walkTree(node, []);
    }

    private walkTree(node: Node, steps: Node[]) {
        const paths: Node[][] = [];
        node.connected.forEach(connected => {
            const nextSteps = steps.slice();
            if (connected.type === NodeType.end) {
                nextSteps.push(connected);
                paths.push(nextSteps);
            }
            if ((connected.type === NodeType.bigCave) || (connected.type === NodeType.smallCave && !steps.includes(connected))) {
                nextSteps.push(connected);
                this.walkTree(connected, nextSteps).forEach(path => paths.push(path));
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
    }
}
