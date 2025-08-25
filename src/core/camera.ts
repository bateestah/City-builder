export class Camera {
  x = 0;
  y = 0;
  scale = 1;

  screenToWorld(x: number, y: number) {
    return {
      x: x / this.scale + this.x,
      y: y / this.scale + this.y,
    };
  }
}
