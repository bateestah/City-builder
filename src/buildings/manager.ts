import { Tile } from '../core/tile';
import { Building, BuildingState } from './building';
import { BuildingDefinition } from './definitions';

/** Manage building placement and updates within a tile map. */
export class BuildingManager {
  buildings: Building[] = [];

  constructor(private world: Tile[][]) {}

  /** Check if a building can be placed at the given coordinates. */
  canPlace(def: BuildingDefinition, x: number, y: number): boolean {
    const { width, height } = def.footprint;

    if (
      x < 0 ||
      y < 0 ||
      y + height > this.world.length ||
      x + width > this.world[0].length
    ) {
      return false; // outside map bounds
    }

    // terrain check
    for (let iy = 0; iy < height; iy++) {
      for (let ix = 0; ix < width; ix++) {
        const tile = this.world[y + iy][x + ix];
        if (!def.allowedTerrain.includes(tile)) return false;
      }
    }

    // collision check
    for (const b of this.buildings) {
      if (
        x < b.x + b.def.footprint.width &&
        x + width > b.x &&
        y < b.y + b.def.footprint.height &&
        y + height > b.y
      ) {
        return false; // overlaps existing building
      }
    }

    // adjacency requirement
    if (def.requiredAdjacency && def.requiredAdjacency.length > 0) {
      let adjacentFound = false;
      for (const b of this.buildings) {
        if (!def.requiredAdjacency.includes(b.def.type)) continue;
        if (this.areAdjacent(x, y, width, height, b)) {
          adjacentFound = true;
          break;
        }
      }
      if (!adjacentFound) return false;
    }

    return true;
  }

  private areAdjacent(
    x: number,
    y: number,
    width: number,
    height: number,
    other: Building
  ): boolean {
    const ox = other.x;
    const oy = other.y;
    const ow = other.def.footprint.width;
    const oh = other.def.footprint.height;

    return (
      (x + width === ox && y < oy + oh && y + height > oy) ||
      (x === ox + ow && y < oy + oh && y + height > oy) ||
      (y + height === oy && x < ox + ow && x + width > ox) ||
      (y === oy + oh && x < ox + ow && x + width > ox)
    );
  }

  /** Place a building if valid. Returns the new building or null. */
  place(def: BuildingDefinition, x: number, y: number): Building | null {
    if (!this.canPlace(def, x, y)) return null;
    const b = new Building(def, x, y);
    this.buildings.push(b);
    return b;
  }

  /** Advance construction/upgrade for all buildings. */
  update(): void {
    for (const b of this.buildings) {
      b.update();
    }
  }

  /** Compute adjacency bonus for the given building. */
  adjacencyBonus(b: Building): number {
    let bonus = 0;
    for (const other of this.buildings) {
      if (other === b) continue;
      if (this.areAdjacent(b.x, b.y, b.def.footprint.width, b.def.footprint.height, other)) {
        bonus += b.def.adjacencyBonuses[other.def.type] || 0;
      }
    }
    return bonus;
  }
}
