export enum Tile {
  Empty,
  Building,
}

export function tileColor(tile: Tile): string {
  switch (tile) {
    case Tile.Building:
      return '#777';
    case Tile.Empty:
    default:
      return '#5caa4f';
  }
}
