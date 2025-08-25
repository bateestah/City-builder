import { Game } from '../src/core/game';
import { Tile } from '../src/core/tile';

describe('Game interactions', () => {
  function createGame(width = 2, height = 2) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    return new Game(ctx, width, height);
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
});

