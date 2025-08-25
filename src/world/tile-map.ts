import { Tile } from './tile';

export class TileMap {
  readonly width: number;
  readonly height: number;
  private readonly tiles: Tile[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = new Array(width * height).fill(Tile.Empty);
  }

  private index(x: number, y: number) {
    return y * this.width + x;
  }

  inBounds(x: number, y: number) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  get(x: number, y: number): Tile {
    return this.tiles[this.index(x, y)];
  }

  set(x: number, y: number, tile: Tile) {
    if (this.inBounds(x, y)) {
      this.tiles[this.index(x, y)] = tile;
    }
  }

  toggle(x: number, y: number) {
    const current = this.get(x, y);
    this.set(x, y, current === Tile.Empty ? Tile.Building : Tile.Empty);
  }
}
