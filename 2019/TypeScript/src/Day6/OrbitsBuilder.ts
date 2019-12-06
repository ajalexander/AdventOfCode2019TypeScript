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

interface NameToOrbitNodeMap extends Map<string, OrbitNode> {
}

interface InputParts {
  leftObject: string;
  rightObject: string;
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

  buildOrbits(inputs: string[]) : OrbitNode | undefined {
    const parsedInputs = this.parseInputs(inputs);
    const orbitsMap = this.buildMap(parsedInputs);
    this.processOrbits(parsedInputs, orbitsMap);
    return this.findCenterOfMass(orbitsMap);
  }
}
