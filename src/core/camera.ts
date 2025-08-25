export class Camera {
  x = 0;
  y = 0;
  zoom = 1;

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }
}
