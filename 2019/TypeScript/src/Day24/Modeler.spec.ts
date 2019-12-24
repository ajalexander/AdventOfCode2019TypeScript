import { expect } from 'chai';
import 'mocha';

import { LocationMap, Location, State, Simulator, MapBuilder } from './Modeler';

describe('LocationMap', () => {
  let map: LocationMap;

  beforeEach(() => {
  });

  describe('constructor', () => {
    it('should setup the locations', () => {
      map = new LocationMap(2, 4);
      expect(map.locations.length).to.equal(8);
    });

    it('should setup neightbors for a corner', () => {
      map = new LocationMap(2, 4);

      const location = map.locationAt(0, 0);
      expect(location.neighbors.length).to.equal(2);
      expect(location.neighbors.includes(map.locationAt(0, 1))).to.equal(true);
      expect(location.neighbors.includes(map.locationAt(1, 0))).to.equal(true);
    });

    it('should setup neightbors for a middle', () => {
      map = new LocationMap(5, 5);

      const location = map.locationAt(2, 2);
      expect(location.neighbors.length).to.equal(4);
      expect(location.neighbors.includes(map.locationAt(2, 1))).to.equal(true);
      expect(location.neighbors.includes(map.locationAt(2, 3))).to.equal(true);
      expect(location.neighbors.includes(map.locationAt(1, 2))).to.equal(true);
      expect(location.neighbors.includes(map.locationAt(3, 2))).to.equal(true);
    });
  });

  describe('biodiversityScore', () => {
    it('should have a score of zero for no infestations', () => {
      map = new LocationMap(5, 5);
      expect(map.biodiversityScore()).to.equal(0);
    });

    it('should score based on powers of two', () => {
      map = new LocationMap(5, 5);
      map.locationAt(0, 3).state = State.infested;
      map.locationAt(1, 4).state = State.infested;

      expect(map.biodiversityScore()).to.equal(2129920);
    });
  });
});

describe('Location', () => {
  let location: Location;

  beforeEach(() => {
    location = new Location(2, 2);
  });

  describe('liveAndDie', () => {
    describe('infested', () => {
      beforeEach(() => {
        location.state = State.infested;
      });

      it('should become empty when no neighbors', () => {
        location.liveAndDie();
        expect(location.state).to.equal(State.empty);
      });

      it('should become empty when more than one infested neighbor', () => {
        location.neighbors.push(new Location(1, 2, State.infested));
        location.neighbors.push(new Location(3, 2, State.infested));
        location.liveAndDie();
        expect(location.state).to.equal(State.empty);
      });

      it('should remain infested when one infested neighbor', () => {
        location.neighbors.push(new Location(1, 2, State.infested));
        location.liveAndDie();
        expect(location.state).to.equal(State.infested);
      });
    });

    describe('empty', () => {
      beforeEach(() => {
        location.state = State.empty;
      });

      it('should remain empty when no neighbors', () => {
        location.liveAndDie();
        expect(location.state).to.equal(State.empty);
      });

      it('should remain empty when more than two infested neighbors', () => {
        location.neighbors.push(new Location(1, 2, State.infested));
        location.neighbors.push(new Location(3, 2, State.infested));
        location.neighbors.push(new Location(2, 1, State.infested));
        location.liveAndDie();
        expect(location.state).to.equal(State.empty);
      });

      it('should become infested when one infested neighbor', () => {
        location.neighbors.push(new Location(1, 2, State.infested));
        location.liveAndDie();
        expect(location.state).to.equal(State.infested);
      });

      it('should become infested when two infested neighbors', () => {
        location.neighbors.push(new Location(1, 2, State.infested));
        location.neighbors.push(new Location(2, 1, State.infested));
        location.liveAndDie();
        expect(location.state).to.equal(State.infested);
      });
    });
  });
});

describe('Simulator', () => {
  let simulator: Simulator;
  let map: LocationMap;

  beforeEach(() => {
    const builder = new MapBuilder();
    map = builder.build([
      '....#',
      '#..#.',
      '#..##',
      '..#..',
      '#....',
    ]);

    simulator = new Simulator(map);
  });

  const compareState = (expectedLines: string[]) => {
    expect(map.toString()).to.equal(expectedLines.join(String.fromCharCode(10)));
  };

  describe('liveAndDie', () => {
    it('should handle one minute', () => {
      simulator.liveAndDie();

      compareState([
        '#..#.',
        '####.',
        '###.#',
        '##.##',
        '.##..',
      ]);
    });

    it('should handle two minutes', () => {
      simulator.liveAndDie();
      simulator.liveAndDie();

      compareState([
        '#####',
        '....#',
        '....#',
        '...#.',
        '#.###',
      ]);
    });

    it('should handle three minutes', () => {
      simulator.liveAndDie();
      simulator.liveAndDie();
      simulator.liveAndDie();

      compareState([
        '#....',
        '####.',
        '...##',
        '#.##.',
        '.##.#',
      ]);
    });

    it('should handle four minutes', () => {
      simulator.liveAndDie();
      simulator.liveAndDie();
      simulator.liveAndDie();
      simulator.liveAndDie();

      compareState([
        '####.',
        '....#',
        '##..#',
        '.....',
        '##...',
      ]);
    });
  });

  describe('findMatchingState', () => {
    it('should solve for matching layouts', () => {
      simulator.findMatchingState();

      compareState([
        '.....',
        '.....',
        '.....',
        '#....',
        '.#...',
      ]);
    });
  });
});
