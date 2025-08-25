export enum Tile {
  Grass,
  Water,
}

/** Return a CSS color for the given tile type. */
export function tileColor(tile: Tile): string {
  switch (tile) {
    case Tile.Water:
      return '#1E90FF'; // dodger blue
    case Tile.Grass:
    default:
      return '#228B22'; // forest green
  }
}

