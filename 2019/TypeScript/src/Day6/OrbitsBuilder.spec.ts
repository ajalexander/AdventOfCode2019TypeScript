import { expect } from 'chai';
import 'mocha';

import { OrbitNode, OrbitsBuilder } from './OrbitsBuilder';

describe('OrbitsBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new OrbitsBuilder();
  });

  describe('buildOrbits', () => {
    it('should return undefined when given an empty array', () => {
      expect(builder.buildOrbits([])).to.eql(undefined);
    });

    it('should return undefined when COM is missing', () => {
      expect(builder.buildOrbits(['A)B'])).to.eql(undefined);
    });

    it('should return handle direct orbits', () => {
      const centerNode = builder.buildOrbits(['COM)A', 'COM)B']);
      expect(centerNode.name).to.equal('COM');
      expect(centerNode.orbitingObjects.length).to.equal(2);
      expect(centerNode.orbitingObjects.some(o => o.name === 'A'));
      expect(centerNode.orbitingObjects.some(o => o.name === 'B'));
    });

    it('should return handle indirect orbits', () => {
      const centerNode = builder.buildOrbits(['COM)A', 'A)B']);
      expect(centerNode.name).to.equal('COM');
      expect(centerNode.orbitingObjects.length).to.equal(1);
      expect(centerNode.orbitingObjects.some(o => o.name === 'A'));

      expect(centerNode.orbitingObjects[0].name).to.equal('A');
      expect(centerNode.orbitingObjects[0].orbitingObjects.length).to.equal(1);
      expect(centerNode.orbitingObjects[0].orbitingObjects.some(o => o.name === 'B'));
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

describe('Integration Test', () => {
  let builder: OrbitsBuilder;

  beforeEach(() => {
    builder = new OrbitsBuilder();
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

    const centerNode = builder.buildOrbits(inputs);

    expect(centerNode.countOrbits()).to.equal(42);
  });
});
