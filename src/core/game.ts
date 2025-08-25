export class Game {
  private lastTime = 0;
  private accumulator = 0;
  private readonly timestep = 1000 / 60; // 60 updates per second
  private running = false;

  constructor(private ctx: CanvasRenderingContext2D) {}

  start() {
    if (this.running) return;
    this.running = true;
    requestAnimationFrame(this.loop);
  }

  private loop = (time: number) => {
    if (!this.running) return;
    const delta = time - this.lastTime;
    this.lastTime = time;
    this.accumulator += delta;

    while (this.accumulator >= this.timestep) {
      this.update(this.timestep / 1000);
      this.accumulator -= this.timestep;
    }

    this.render();
    requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // Update game state here
  }

  private render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    // Render game objects here
  }
}
