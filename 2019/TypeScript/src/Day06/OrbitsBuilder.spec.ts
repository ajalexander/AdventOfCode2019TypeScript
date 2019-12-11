import { expect } from 'chai';
import 'mocha';

import { BuiltOrbits, NameToOrbitNodeMap, OrbitNode, OrbitsBuilder, TransferStepsCalculator } from './OrbitsBuilder';

describe('OrbitsBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new OrbitsBuilder();
  });

  describe('buildOrbits', () => {
    it('should return undefined center when given an empty array', () => {
      const builtOrbits = builder.buildOrbits([]);
      expect(builtOrbits.centerOfMass).to.eql(undefined);
    });

    it('should return undefined when COM is missing', () => {
      const builtOrbits = builder.buildOrbits(['A)B']);
      expect(builtOrbits.centerOfMass).to.eql(undefined);
    });

    it('should return handle direct orbits', () => {
      const builtOrbits = builder.buildOrbits(['COM)A', 'COM)B']);

      expect(builtOrbits.centerOfMass.name).to.equal('COM');
      expect(builtOrbits.centerOfMass.orbitingObjects.length).to.equal(2);
      expect(builtOrbits.centerOfMass.orbitingObjects.some(o => o.name === 'A'));
      expect(builtOrbits.centerOfMass.orbitingObjects.some(o => o.name === 'B'));
    });

    it('should return handle indirect orbits', () => {
      const builtOrbits = builder.buildOrbits(['COM)A', 'A)B']);

      expect(builtOrbits.centerOfMass.name).to.equal('COM');
      expect(builtOrbits.centerOfMass.orbitingObjects.length).to.equal(1);
      expect(builtOrbits.centerOfMass.orbitingObjects.some(o => o.name === 'A'));

      expect(builtOrbits.centerOfMass.orbitingObjects[0].name).to.equal('A');
      expect(builtOrbits.centerOfMass.orbitingObjects[0].orbitingObjects.length).to.equal(1);
      expect(builtOrbits.centerOfMass.orbitingObjects[0].orbitingObjects.some(o => o.name === 'B'));
    });
  });
});

describe('OrbitNode', () => {
  describe('constructor', () => {
    it('should set the name', () => {
      const orbitNode = new OrbitNode('A');
      expect(orbitNode.name).to.equal('A');
    });

    it('should initialize the orbitingObjects array', () => {
      const orbitNode = new OrbitNode('');
      expect(orbitNode.orbitingObjects).to.eql([]);
    });
  });

  describe('addChild', () => {
    it('should add to orbitingObjects array', () => {
      const orbitNode = new OrbitNode('');
      const child = new OrbitNode('');

      orbitNode.addChild(child);

      expect(orbitNode.orbitingObjects.includes(child)).to.equal(true);
    });

    it('should set parent on the child', () => {
      const orbitNode = new OrbitNode('');
      const child = new OrbitNode('');

      orbitNode.addChild(child);

      expect(child.parent).to.equal(orbitNode);
    });
  });

  describe('distanceTo', () => {
    it('should handle single level', () => {
      const orbitNodeA = new OrbitNode('A');
      const orbitNodeB = new OrbitNode('B');

      orbitNodeA.addChild(orbitNodeB);

      expect(orbitNodeB.distanceTo(orbitNodeA)).to.equal(1);
    });

    it('should handle multiple levels', () => {
      const orbitNodeA = new OrbitNode('A');
      const orbitNodeB = new OrbitNode('B');
      const orbitNodeC = new OrbitNode('C');

      orbitNodeA.addChild(orbitNodeB);
      orbitNodeB.addChild(orbitNodeC);

      expect(orbitNodeC.distanceTo(orbitNodeA)).to.equal(2);
    });
  });

  describe('countOrbits', () => {
    it('should handle direct orbits', () => {
      const orbitNodeA = new OrbitNode('A');
      const orbitNodeB1 = new OrbitNode('B1');
      const orbitNodeB2 = new OrbitNode('B2');

      orbitNodeA.addChild(orbitNodeB1);
      orbitNodeA.addChild(orbitNodeB2);

      expect(orbitNodeA.countOrbits()).to.equal(2);
    });

    it('should handle indirect orbits', () => {
      const orbitNodeA = new OrbitNode('A');
      const orbitNodeB = new OrbitNode('B');
      const orbitNodeC1 = new OrbitNode('C1');
      const orbitNodeC2 = new OrbitNode('C2');

      orbitNodeA.addChild(orbitNodeB);
      orbitNodeB.addChild(orbitNodeC1);
      orbitNodeB.addChild(orbitNodeC2);

      expect(orbitNodeA.countOrbits()).to.equal(5);
    });
  });
});

describe('TransferStepsCalculator', () => {
  let calculator: TransferStepsCalculator;

  beforeEach(() => {
    calculator = new TransferStepsCalculator();
  });

  describe('stepsToTarget', () => {
    it('should build steps', () => {
      const orbitNodeA = new OrbitNode('A');
      const orbitNodeB = new OrbitNode('B');
      const orbitNodeC = new OrbitNode('C');

      orbitNodeA.addChild(orbitNodeB);
      orbitNodeB.addChild(orbitNodeC);

      expect(calculator.stepsToTarget(orbitNodeA, orbitNodeC)).to.eql([orbitNodeB, orbitNodeA]);
      expect(calculator.stepsToTarget(orbitNodeB, orbitNodeC)).to.eql([orbitNodeB]);
    });
  });

  describe('stepsBetweenNodes', () => {
    it('should find the nodes between points', () => {
      /*
            /-> C -> E
      A -> B
            \-> D -> F
      */
      const orbitNodeA = new OrbitNode('A');
      const orbitNodeB = new OrbitNode('B');
      const orbitNodeC = new OrbitNode('C');
      const orbitNodeD = new OrbitNode('D');
      const orbitNodeE = new OrbitNode('E');
      const orbitNodeF = new OrbitNode('F');

      orbitNodeA.addChild(orbitNodeB);
      orbitNodeB.addChild(orbitNodeC);
      orbitNodeB.addChild(orbitNodeD);
      orbitNodeC.addChild(orbitNodeE);
      orbitNodeD.addChild(orbitNodeF);

      const orbitMap: NameToOrbitNodeMap = new Map<string, OrbitNode>();
      orbitMap[orbitNodeA.name] = orbitNodeA;
      orbitMap[orbitNodeB.name] = orbitNodeB;
      orbitMap[orbitNodeC.name] = orbitNodeC;
      orbitMap[orbitNodeD.name] = orbitNodeD;
      orbitMap[orbitNodeE.name] = orbitNodeE;
      orbitMap[orbitNodeF.name] = orbitNodeF;

      const builtOrbits: BuiltOrbits = {
        centerOfMass: orbitNodeA,
        orbitsMap: orbitMap,
      };

      const nodes = calculator.stepsBetweenNodes(builtOrbits, orbitNodeE.name, orbitNodeF.name);
      expect(nodes).to.eql([orbitNodeC, orbitNodeB, orbitNodeD]);
    });
  });
});

describe('Integration Test', () => {
  let builder: OrbitsBuilder;
  let calculator: TransferStepsCalculator;

  beforeEach(() => {
    builder = new OrbitsBuilder();
    calculator = new TransferStepsCalculator();
  });

  it('should handle example 1', () => {
    const inputs = [
      'COM)B',
      'B)C',
      'C)D',
      'D)E',
      'E)F',
      'B)G',
      'G)H',
      'D)I',
      'E)J',
      'J)K',
      'K)L',
    ];

    const builtOrbits = builder.buildOrbits(inputs);

    expect(builtOrbits.centerOfMass.countOrbits()).to.equal(42);
  });

  it('should handle example 2', () => {
    const inputs = [
      'COM)B',
      'B)C',
      'C)D',
      'D)E',
      'E)F',
      'B)G',
      'G)H',
      'D)I',
      'E)J',
      'J)K',
      'K)L',
      'K)YOU',
      'I)SAN',
    ];

    const builtOrbits = builder.buildOrbits(inputs);
    const transfersRequired = calculator.transfersRequiredBetweenNodes(builtOrbits, 'YOU', 'SAN');

    expect(transfersRequired).to.equal(4);
  });
});
