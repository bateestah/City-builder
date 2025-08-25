export class Camera {
  public x = 0;
  public y = 0;
  public scale = 1;

  /**
   * Convert screen coordinates to world coordinates based on the
   * current camera translation and zoom level.
   */
  screenToWorld(screenX: number, screenY: number) {
    return {
      x: (screenX - this.x) / this.scale,
      y: (screenY - this.y) / this.scale,
    };
  }
}

