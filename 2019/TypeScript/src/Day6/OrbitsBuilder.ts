export class OrbitNode {
  name: string;
  parent: OrbitNode;
  orbitingObjects: OrbitNode[];

  constructor(name: string) {
    this.name = name;
    this.orbitingObjects = [];
  }

  addChild(child: OrbitNode) {
    this.orbitingObjects.push(child);
    child.parent = this;
  }

  distanceTo(target: OrbitNode) : number {
    let distance = 1;
    let current: OrbitNode = this;
    while (current.parent !== target && current.parent !== null) {
      distance += 1;
      current = current.parent;
    }
    return distance;
  }

  private countOrbitsToTarget(target: OrbitNode) : number {
    const directDistance = (this === target) ? 0 : this.distanceTo(target);
    const indirectDistances = this.orbitingObjects.reduce((acc: number, node: OrbitNode) => acc += node.countOrbitsToTarget(target), 0);
    const orbitCount = directDistance + indirectDistances;

    // console.log(`Node #${this.name} - ${orbitCount}`);

    return orbitCount;
  }

  countOrbits() : number {
    return this.countOrbitsToTarget(this);
  }
}

export interface NameToOrbitNodeMap extends Map<string, OrbitNode> {
}

interface InputParts {
  leftObject: string;
  rightObject: string;
}

export interface BuiltOrbits {
  centerOfMass: OrbitNode;
  orbitsMap: NameToOrbitNodeMap;
}

export class OrbitsBuilder {
  private leftHalf(input: string) {
    return input.split(')')[0];
  }

  private rightHalf(input: string) {
    return input.split(')')[1];
  }

  private buildMap(inputs: InputParts[]) : NameToOrbitNodeMap {
    const nameToObject = new Map<string, OrbitNode>();
    inputs.forEach((input: InputParts) => {
      if (!nameToObject.has(input.leftObject)) {
        nameToObject[input.leftObject] = new OrbitNode(input.leftObject);
      }

      if (!nameToObject.has(input.rightObject)) {
        nameToObject[input.rightObject] = new OrbitNode(input.rightObject);
      }
    });
    return nameToObject;
  }

  private parseInputs(inputs: string[]) : InputParts[] {
    return inputs.map((input: string) => {
      return {
        leftObject: this.leftHalf(input),
        rightObject: this.rightHalf(input),
      } as InputParts
    });
  };

  private processOrbits(inputs: InputParts[], orbitsMap: NameToOrbitNodeMap) {
    inputs.forEach((input: InputParts) => {
      const leftObject = orbitsMap[input.leftObject];
      const rightObject = orbitsMap[input.rightObject];
      
      leftObject.addChild(rightObject);
    });
  }

  private findCenterOfMass(orbitsMap: NameToOrbitNodeMap) {
    return orbitsMap['COM'];
  }

  buildOrbits(inputs: string[]) : BuiltOrbits {
    const parsedInputs = this.parseInputs(inputs);
    const orbitsMap = this.buildMap(parsedInputs);
    this.processOrbits(parsedInputs, orbitsMap);
    const center = this.findCenterOfMass(orbitsMap);

    return {
      centerOfMass: center,
      orbitsMap: orbitsMap
    } as BuiltOrbits;
  }
}

export class TransferStepsCalculator {
  stepsToTarget(targetNode: OrbitNode, fromNode: OrbitNode) : OrbitNode[] {
    const nodes = [];
    let currentNode = fromNode;
    while (currentNode.parent !== targetNode) {
      nodes.push(currentNode.parent);
      currentNode = currentNode.parent;
    }
    nodes.push(targetNode);
    return nodes;
  }

  stepsBetweenNodes(builtOrbits: BuiltOrbits, startingNodeName: string, endingNodeName: string) : OrbitNode[] {
    const startingNode = builtOrbits.orbitsMap[startingNodeName];
    const endingNode = builtOrbits.orbitsMap[endingNodeName];

    const nodesBetween = [];

    const startToCenter = this.stepsToTarget(builtOrbits.centerOfMass, startingNode);
    const endToCenter = this.stepsToTarget(builtOrbits.centerOfMass, endingNode);

    for (let index = 0; index < startToCenter.length; index += 1) {
      const node = startToCenter[index];
      nodesBetween.push(node);
      const indexInOtherPath = endToCenter.indexOf(node);
      if (indexInOtherPath >= 0) {
        for (index = 0; index < indexInOtherPath; index += 1) {
          const otherNode = endToCenter[index];
          nodesBetween.push(otherNode);
        }
        break;
      }
    }

    return nodesBetween;
  }

  transfersRequiredBetweenNodes(builtOrbits: BuiltOrbits, startingNodeName: string, endingNodeName: string) : number {
    return this.stepsBetweenNodes(builtOrbits, startingNodeName, endingNodeName).length - 1;
  }
}
