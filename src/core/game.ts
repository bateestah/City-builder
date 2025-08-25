import { Camera } from './camera';
import { World, TILE_SIZE, Tile } from '../world';

export class Game {
  private last = 0;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly camera = new Camera();
  private readonly world = new World(100, 100);

  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private dragMoved = false;
  private cameraStart = { x: 0, y: 0 };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.bindInput();
    requestAnimationFrame(this.loop);
  }

  private bindInput() {
    const canvas = this.ctx.canvas;

    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragMoved = false;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.cameraStart = { x: this.camera.x, y: this.camera.y };
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = (e.clientX - this.dragStart.x) / this.camera.scale;
      const dy = (e.clientY - this.dragStart.y) / this.camera.scale;
      if (dx !== 0 || dy !== 0) this.dragMoved = true;
      this.camera.x = this.cameraStart.x - dx;
      this.camera.y = this.cameraStart.y - dy;
    });

    const endDrag = (e: MouseEvent) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (!this.dragMoved) {
        this.handleClick(e.offsetX, e.offsetY);
      }
    };

    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('mouseleave', endDrag);

    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const before = this.camera.screenToWorld(e.offsetX, e.offsetY);
        this.camera.scale *= scaleFactor;
        const after = this.camera.screenToWorld(e.offsetX, e.offsetY);
        this.camera.x += before.x - after.x;
        this.camera.y += before.y - after.y;
      },
      { passive: false }
    );
  }

  private handleClick(x: number, y: number) {
    const worldPos = this.camera.screenToWorld(x, y);
    const tx = Math.floor(worldPos.x / TILE_SIZE);
    const ty = Math.floor(worldPos.y / TILE_SIZE);
    const current = this.world.get(tx, ty);
    const next = current === Tile.Grass ? Tile.Water : Tile.Grass;
    this.world.set(tx, ty, next);
  }

  private loop = (timestamp: number) => {
    const delta = (timestamp - this.last) / 1000;
    this.last = timestamp;

    this.update(delta);
    this.render();
    requestAnimationFrame(this.loop);
  };

  private update(_dt: number) {
    // Update game state if needed
  }

  private render() {
    const { ctx } = this;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.world.render(ctx, this.camera);
  }
}
