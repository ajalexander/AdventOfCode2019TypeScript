export enum State {
  infested,
  empty,
}

export class Location {
  x: number;
  y: number;
  state: State;
  neighbors: Location[];

  private nextState?: State;

  constructor(x: number, y: number, state: State = State.empty) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.neighbors = [];
  }

  prepareToLiveAndDie() {
    this.nextState = this.state;

    const adjacentBugs = this.neighbors.filter(l => l.state === State.infested).length;
    if (this.state === State.infested) {
      if (adjacentBugs !== 1) {
        this.nextState = State.empty;
      }
    } else {
      if (adjacentBugs === 1 || adjacentBugs === 2) {
        this.nextState = State.infested;
      }
    }
  }

  liveAndDie() {
    if (this.nextState === undefined) {
      this.prepareToLiveAndDie();
    }
    this.state = this.nextState;
    this.nextState = undefined;
  }

  print() {
    return (this.state === State.empty) ? '.' : '#';
  }
}

export class LocationMap {
  locations: Location[];
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.locations = [];
    this.width = width;
    this.height = height;

    this.initializeLocations();
    this.setupNeighbors();    
  }

  private initializeLocations() {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        this.locations.push(new Location(x, y));
      }
    }
  }

  private setupNeighbors() {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const location = this.locationAt(x, y);

        if (y < this.height - 1) {
          location.neighbors.push(this.locationAt(x, y + 1));
        }
        if (y > 0) {
          location.neighbors.push(this.locationAt(x, y - 1));
        }
        if (x < this.width - 1) {
          location.neighbors.push(this.locationAt(x + 1, y));
        }
        if (x > 0) {
          location.neighbors.push(this.locationAt(x - 1, y));
        }
      }
    }
  }

  locationAt(x: number, y: number) {
    return this.locations.find(l => l.x === x && l.y === y);
  }

  toString() {
    const lines = [];
    for (let y = 0; y < this.height; y += 1) {
      const line = [];
      for (let x = 0; x < this.width; x += 1) {
        line.push(this.locationAt(x, y).print());
      }
      lines.push(line.join(''));
    }
    return lines.join(String.fromCharCode(10));
  }

  print() {
    console.log(this.toString());
  }

  biodiversityScore() {
    let currentPower = 0;
    let score = 0;
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        if (this.locationAt(x, y).state === State.infested) {
          score += Math.pow(2, currentPower);
        }
        currentPower += 1;
      }
    }
    return score;
  }
}

export class MapBuilder {
  build(lines: string[]) : LocationMap {
    const height = lines.length;
    const width = lines[0].length;

    const map = new LocationMap(height, width);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (lines[y][x] === '#') {
          map.locationAt(x, y).state = State.infested;
        }
      }
    }

    return map;
  }
}

export class Simulator {
  map: LocationMap;
  states: string[];

  constructor(map: LocationMap) {
    this.map = map;
    this.states = [];
  }

  liveAndDie() {
    this.map.locations.forEach((location) => {
      location.prepareToLiveAndDie();
    });
    this.map.locations.forEach((location) => {
      location.liveAndDie();
    });
  }

  findMatchingState() {
    this.states.push(this.map.toString());
    while (true) {
      this.liveAndDie();
      const currentState = this.map.toString();
      this.states.push(currentState);

      if (this.states.indexOf(currentState) !== this.states.lastIndexOf(currentState)) {
        return;
      }
    }
  }

  print() {
    this.states.forEach((state, index) => {
      console.log(`Day ${index}`);
      console.log(state);
      console.log('');
    });
  }
}
