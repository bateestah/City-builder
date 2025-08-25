export class Game {
  private last = 0;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
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
    // TODO: update game state
  }

  private render() {
    const { ctx } = this;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // TODO: draw game
  }
}
