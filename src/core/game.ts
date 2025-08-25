import { Camera } from './camera';
import { Tile, tileColor } from './tile';

/**
 * Minimal game logic used for unit testing. It keeps a small tile map and a
 * camera that can be panned and zoomed via simple event handlers.
 */
export class Game {
  public readonly camera = new Camera();
  public readonly map: Tile[][];

  /** size of a tile in pixels */
  public readonly tileSize: number;
  private isPanning = false;
  private lastPan = { x: 0, y: 0 };

  constructor(ctx: CanvasRenderingContext2D, width = 10, height = 10, tileSize = 32) {
    this.ctx = ctx;
    this.tileSize = tileSize;
    this.map = Array.from({ length: height }, () =>
      Array(width).fill(Tile.Grass)
    );
  }

  private readonly ctx: CanvasRenderingContext2D;

  /** Toggle the tile at the clicked screen position between grass and water. */
  handleClick(screenX: number, screenY: number) {
    const world = this.camera.screenToWorld(screenX, screenY);
    const tx = Math.floor(world.x / this.tileSize);
    const ty = Math.floor(world.y / this.tileSize);

    if (ty < 0 || ty >= this.map.length || tx < 0 || tx >= this.map[0].length) {
      return; // click outside the map
    }

    this.map[ty][tx] =
      this.map[ty][tx] === Tile.Grass ? Tile.Water : Tile.Grass;
  }

  /** Begin panning the camera. */
  handleMouseDown(x: number, y: number) {
    this.isPanning = true;
    this.lastPan = { x, y };
  }

  /** Update the camera position while panning. */
  handleMouseMove(x: number, y: number) {
    if (!this.isPanning) return;
    this.camera.x += x - this.lastPan.x;
    this.camera.y += y - this.lastPan.y;
    this.lastPan = { x, y };
  }

  /** Stop panning the camera. */
  handleMouseUp() {
    this.isPanning = false;
  }

  /** Adjust the camera zoom based on scroll delta. */
  handleWheel(deltaY: number) {
    const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
    this.camera.scale *= zoomFactor;
  }

  /** Render the current map and grid. */
  render() {
    const { ctx } = this;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.scale, this.camera.scale);

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tile = this.map[y][x];
        const px = x * this.tileSize;
        const py = y * this.tileSize;
        ctx.fillStyle = tileColor(tile);
        ctx.fillRect(px, py, this.tileSize, this.tileSize);
        // grid overlay
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.strokeRect(px, py, this.tileSize, this.tileSize);
      }
    }

    ctx.restore();
  }
}

