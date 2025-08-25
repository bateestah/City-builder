export const TILE_SIZE = 32;

export class Tile {
  constructor(public x: number, public y: number) {}
}

export class World {
  tiles: Tile[] = [];

  addTile(tile: Tile): void {
    this.tiles.push(tile);
  }
}

