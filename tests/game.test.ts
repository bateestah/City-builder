import { Game } from '../src/core/game';
import { Tile } from '../src/core/tile';

describe('Game interactions', () => {
  function createMockCtx(width = 100, height = 100): any {
    return {
      canvas: { width, height },
      save: jest.fn(),
      restore: jest.fn(),
      clearRect: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      fillStyle: '',
      strokeStyle: '',
    };
  }

  function createGame(width = 2, height = 2) {
    const ctx = createMockCtx();
    return new Game(ctx, width, height, 32);
  }

  test('handleClick toggles tiles', () => {
    const game = createGame(1, 1);
    expect(game.map[0][0]).toBe(Tile.Grass);
    game.handleClick(0, 0);
    expect(game.map[0][0]).toBe(Tile.Water);
    game.handleClick(0, 0);
    expect(game.map[0][0]).toBe(Tile.Grass);
  });

  test('handleClick ignores clicks outside the map', () => {
    const game = createGame(1, 1);
    game.handleClick(100, 100);
    expect(game.map[0][0]).toBe(Tile.Grass);
  });

  test('panning updates camera position', () => {
    const game = createGame();
    game.handleMouseDown(0, 0);
    game.handleMouseMove(10, 5);
    game.handleMouseUp();
    expect(game.camera.x).toBe(10);
    expect(game.camera.y).toBe(5);
  });

  test('wheel updates camera scale', () => {
    const game = createGame();
    const initial = game.camera.scale;
    game.handleWheel(-1); // zoom in
    expect(game.camera.scale).toBeCloseTo(initial * 1.1);
    game.handleWheel(1); // zoom out
    expect(game.camera.scale).toBeCloseTo(initial * 1.1 * 0.9);
  });

  test('render draws tiles and grid with camera transform', () => {
    const mockCtx = createMockCtx(64, 64);
    const game = new Game(mockCtx, 2, 2, 32);
    game.render();

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 64, 64);
    expect(mockCtx.translate).toHaveBeenCalledWith(game.camera.x, game.camera.y);
    expect(mockCtx.scale).toHaveBeenCalledWith(game.camera.scale, game.camera.scale);
    expect(mockCtx.fillRect).toHaveBeenCalledTimes(4); // 2x2 tiles
    expect(mockCtx.strokeRect).toHaveBeenCalledTimes(4); // grid overlay
  });
});

