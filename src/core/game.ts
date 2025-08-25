import { Camera } from './camera';
import { Tile } from './tile';

/**
 * Minimal game logic used for unit testing. It keeps a small tile map and a
 * camera that can be panned and zoomed via simple event handlers.
 */
export class Game {
  public readonly camera = new Camera();
  public readonly map: Tile[][];

  private readonly tileSize = 1; // size of a tile in world units
  private isPanning = false;
  private lastPan = { x: 0, y: 0 };

  constructor(ctx: CanvasRenderingContext2D, width = 10, height = 10) {
    // The rendering context is kept for completeness but is not used in tests.
    this.ctx = ctx;
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
}

