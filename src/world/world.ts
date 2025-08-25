export const TILE_SIZE = 32;

export enum Tile {
  Grass,
  Water,
}

export class World {
  private readonly tiles: Tile[];

  constructor(public readonly width: number, public readonly height: number) {
    this.tiles = new Array(width * height).fill(Tile.Grass);
  }

  get(x: number, y: number): Tile {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return Tile.Grass;
    return this.tiles[y * this.width + x];
  }

  set(x: number, y: number, tile: Tile) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.tiles[y * this.width + x] = tile;
  }

  render(
    ctx: CanvasRenderingContext2D,
    camera: { x: number; y: number; scale: number }
  ) {
    const { width: canvasWidth, height: canvasHeight } = ctx.canvas;
    const scale = camera.scale;

    const startX = Math.max(0, Math.floor((-camera.x) / (scale * TILE_SIZE)));
    const startY = Math.max(0, Math.floor((-camera.y) / (scale * TILE_SIZE)));
    const endX = Math.min(
      this.width,
      Math.ceil((canvasWidth - camera.x) / (scale * TILE_SIZE))
    );
    const endY = Math.min(
      this.height,
      Math.ceil((canvasHeight - camera.y) / (scale * TILE_SIZE))
    );

    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, camera.x, camera.y);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const tile = this.get(x, y);
        ctx.fillStyle = tile === Tile.Water ? '#6fa8dc' : '#93c47d';
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    ctx.restore();
  }
}

