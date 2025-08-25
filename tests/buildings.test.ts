import {
  BuildingManager,
  BUILDING_DEFINITIONS,
  BuildingState,
} from '../src/buildings';
import { Tile } from '../src/core/tile';

describe('Building definitions and placement', () => {
  test('definitions include required fields', () => {
    const house = BUILDING_DEFINITIONS.house;
    expect(house.footprint.width).toBe(1);
    expect(house.cost.wood).toBe(5);
    expect(house.workers).toBe(0);
    expect(house.inputs).toEqual({});
    expect(house.outputs.population).toBe(1);
    expect(house.storage.people).toBe(5);
    expect(house.adjacencyBonuses).toHaveProperty('house');
  });

  test('placement validation terrain and collisions', () => {
    const map = [
      [Tile.Grass, Tile.Grass, Tile.Grass],
      [Tile.Grass, Tile.Grass, Tile.Grass],
      [Tile.Grass, Tile.Grass, Tile.Water],
    ];
    const mgr = new BuildingManager(map);
    const house = BUILDING_DEFINITIONS.house;
    expect(mgr.canPlace(house, 0, 0)).toBe(true);
    const b1 = mgr.place(house, 0, 0);
    expect(b1).not.toBeNull();
    expect(mgr.canPlace(house, 0, 0)).toBe(false); // collision
    expect(mgr.canPlace(house, 2, 2)).toBe(false); // water tile
  });

  test('adjacency requirement is enforced', () => {
    const map = [
      [Tile.Grass, Tile.Grass, Tile.Grass],
      [Tile.Grass, Tile.Grass, Tile.Grass],
      [Tile.Grass, Tile.Grass, Tile.Grass],
    ];
    const mgr = new BuildingManager(map);
    const house = BUILDING_DEFINITIONS.house;
    const warehouse = BUILDING_DEFINITIONS.warehouse;
    expect(mgr.canPlace(warehouse, 1, 1)).toBe(false); // needs house adjacent
    mgr.place(house, 0, 1); // place adjacent house
    expect(mgr.canPlace(warehouse, 1, 1)).toBe(true);
  });

  test('construction phases and upgrades progress with updates', () => {
    const map = [
      [Tile.Grass, Tile.Grass],
      [Tile.Grass, Tile.Grass],
    ];
    const mgr = new BuildingManager(map);
    const house = mgr.place(BUILDING_DEFINITIONS.house, 0, 0);
    if (!house) throw new Error('Failed to place house');

    expect(house.state).toBe(BuildingState.Construction);
    expect(house.animationFrame).toBe(0);
    expect(house.level).toBe(0);

    mgr.update(); // tick 1
    expect(house.state).toBe(BuildingState.Construction);
    expect(house.animationFrame).toBe(1);

    mgr.update(); // tick 2 completes construction
    expect(house.state).toBe(BuildingState.Active);
    expect(house.level).toBe(1);

    house.startUpgrade();
    expect(house.state).toBe(BuildingState.Upgrading);
    mgr.update();
    mgr.update();
    expect(house.state).toBe(BuildingState.Active);
    expect(house.level).toBe(2);
  });
});
