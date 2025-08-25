import { Camera } from '../src/core/camera';

describe('Camera.screenToWorld', () => {
  it('converts coordinates for various scales', () => {
    const cam = new Camera();

    expect(cam.screenToWorld(10, 20)).toEqual({ x: 10, y: 20 });

    cam.scale = 2;
    expect(cam.screenToWorld(10, 20)).toEqual({ x: 5, y: 10 });

    cam.scale = 0.5;
    expect(cam.screenToWorld(10, 20)).toEqual({ x: 20, y: 40 });
  });
});

