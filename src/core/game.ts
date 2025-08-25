import { Camera } from './camera';
import { TileMap, tileColor } from '../world';

const TILE_SIZE = 32;

export class Game {
  private last = 0;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly world: TileMap;
  private readonly camera = new Camera();
  private dragging = false;
  private lastPos = { x: 0, y: 0 };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.world = new TileMap(100, 100);

    const canvas = ctx.canvas;
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointerleave', this.onPointerUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });

    requestAnimationFrame(this.loop);
  }

  private loop = (timestamp: number) => {
    const delta = (timestamp - this.last) / 1000;
    this.last = timestamp;

    this.update(delta);
    this.render();
    requestAnimationFrame(this.loop);
  };

  private update(_dt: number) {
    // For future simulation logic
  }

  private render() {
    const { ctx, camera, world } = this;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    const startX = Math.floor(camera.x / TILE_SIZE);
    const startY = Math.floor(camera.y / TILE_SIZE);
    const endX = Math.ceil((camera.x + ctx.canvas.width / camera.zoom) / TILE_SIZE);
    const endY = Math.ceil((camera.y + ctx.canvas.height / camera.zoom) / TILE_SIZE);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (!world.inBounds(x, y)) continue;
        ctx.fillStyle = tileColor(world.get(x, y));
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    ctx.restore();
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.button === 0) {
      const { x, y } = this.toWorld(e.clientX, e.clientY);
      const tx = Math.floor(x / TILE_SIZE);
      const ty = Math.floor(y / TILE_SIZE);
      this.world.toggle(tx, ty);
    } else {
      this.dragging = true;
      this.lastPos = { x: e.clientX, y: e.clientY };
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.dragging) {
      const dx = (e.clientX - this.lastPos.x) / this.camera.zoom;
      const dy = (e.clientY - this.lastPos.y) / this.camera.zoom;
      this.camera.move(-dx, -dy);
      this.lastPos = { x: e.clientX, y: e.clientY };
    }
  };

  private onPointerUp = (_e: PointerEvent) => {
    this.dragging = false;
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const worldPos = this.toWorld(e.clientX, e.clientY);
    const scale = e.deltaY > 0 ? 0.9 : 1.1;
    this.camera.zoom = Math.min(4, Math.max(0.5, this.camera.zoom * scale));
    this.camera.x = worldPos.x - (e.clientX / this.camera.zoom);
    this.camera.y = worldPos.y - (e.clientY / this.camera.zoom);
  };

  private toWorld(clientX: number, clientY: number) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / this.camera.zoom + this.camera.x,
      y: (clientY - rect.top) / this.camera.zoom + this.camera.y,
    };
  }
}
