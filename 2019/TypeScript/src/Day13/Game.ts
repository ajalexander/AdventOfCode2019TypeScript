import { InMemoryBufferIOManager } from '../Common/IOManager';
import { CodeProcessor, ProgramState } from '../Common/CodeProcessor';

export enum TileState {
  empty,
  wall,
  block,
  paddle,
  ball
}

export class Tile {
  x: number;
  y: number;
  state: TileState;

  constructor(x: number, y: number) {
    this.state = TileState.empty;
  }

  setState(tileId: number) {
    this.state = tileId;
  }
}

export class GameState {
  tiles: Tile[];

  constructor() {
    this.tiles = [];
  }

  tileAt(x: number, y: number) : Tile {
    let tile = this.tiles.find(t => t.x === x && t.y === y);
    if (tile === undefined) {
      tile = new Tile(x, y);
      this.tiles.push(tile)
    }
    return tile;
  }
}

export class Game {
  gameState: GameState;
  codeProcessor: CodeProcessor;
  ioManager: InMemoryBufferIOManager;

  constructor(ioManager: InMemoryBufferIOManager = new InMemoryBufferIOManager()) {
    this.ioManager = ioManager;
    this.codeProcessor = new CodeProcessor(this.ioManager);
  }

  setup(programState: ProgramState) {
    this.codeProcessor.processCodes(programState);

    this.gameState = new GameState();

    const buffer = this.ioManager.outputBuffer;
    for (let index = 0; index < buffer.length; index += 3) {
      const [x, y, id] = buffer.slice(index);
      const tile = this.gameState.tileAt(x, y);
      tile.setState(id);
    }
  }
}
