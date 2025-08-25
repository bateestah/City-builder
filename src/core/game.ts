import { Camera } from './camera';
import { World, TILE_SIZE, Tile } from '../world';

/**
 * Game loop and input handling for a simple tile-based world. Supports
 * panning, zooming, and clicking tiles to toggle between grass and water.
 */
export class Game {
  public readonly camera = new Camera();
  public readonly world: World;

  private last = 0;
  private isPanning = false;
  private lastPan = { x: 0, y: 0 };

  constructor(private readonly ctx: CanvasRenderingContext2D, width = 100, height = 100) {
    this.world = new World(width, height);
    this.bindEvents();
    requestAnimationFrame(this.loop);
  }

  private bindEvents() {
    const canvas = this.ctx.canvas;
    canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e.clientX, e.clientY));
    canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e.clientX, e.clientY));
    canvas.addEventListener('mouseup', () => this.handleMouseUp());
    canvas.addEventListener('mouseleave', () => this.handleMouseUp());
    canvas.addEventListener('click', (e) => this.handleClick(e.offsetX, e.offsetY));
    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.handleWheel(e.deltaY, e.offsetX, e.offsetY);
      },
      { passive: false }
    );
  }

  handleClick(screenX: number, screenY: number) {
    const worldPos = this.camera.screenToWorld(screenX, screenY);
    const tx = Math.floor(worldPos.x / TILE_SIZE);
    const ty = Math.floor(worldPos.y / TILE_SIZE);
    const current = this.world.get(tx, ty);
    const next = current === Tile.Grass ? Tile.Water : Tile.Grass;
    this.world.set(tx, ty, next);
  }

  handleMouseDown(x: number, y: number) {
    this.isPanning = true;
    this.lastPan = { x, y };
  }

  handleMouseMove(x: number, y: number) {
    if (!this.isPanning) return;
    this.camera.x += x - this.lastPan.x;
    this.camera.y += y - this.lastPan.y;
    this.lastPan = { x, y };
  }

  handleMouseUp() {
    this.isPanning = false;
  }

  handleWheel(deltaY: number, x = 0, y = 0) {
    const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
    const before = this.camera.screenToWorld(x, y);
    this.camera.scale *= zoomFactor;
    this.camera.x = x - before.x * this.camera.scale;
    this.camera.y = y - before.y * this.camera.scale;
  }

  private loop = (timestamp: number) => {
    const dt = (timestamp - this.last) / 1000;
    this.last = timestamp;

    this.update(dt);
    this.render();
    requestAnimationFrame(this.loop);
  };

  private update(_dt: number) {
    // Future game state updates
  }

  private render() {
    const { ctx } = this;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.world.render(ctx, this.camera);
  }
}

