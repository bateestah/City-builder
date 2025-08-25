import { Tile } from '../core/tile';

export interface ResourceMap {
  [key: string]: number;
}

export interface BuildingDefinition {
  type: string;
  footprint: { width: number; height: number };
  cost: ResourceMap;
  workers: number;
  inputs: ResourceMap;
  outputs: ResourceMap;
  storage: ResourceMap;
  adjacencyBonuses: { [buildingType: string]: number };
  allowedTerrain: Tile[];
  requiredAdjacency?: string[];
  constructionTime: number; // ticks needed to build or upgrade
  maxLevel: number;
}

export const BUILDING_DEFINITIONS: Record<string, BuildingDefinition> = {
  house: {
    type: 'house',
    footprint: { width: 1, height: 1 },
    cost: { wood: 5 },
    workers: 0,
    inputs: {},
    outputs: { population: 1 },
    storage: { people: 5 },
    adjacencyBonuses: { house: 0.1 },
    allowedTerrain: [Tile.Grass],
    constructionTime: 2,
    maxLevel: 3,
  },
  warehouse: {
    type: 'warehouse',
    footprint: { width: 2, height: 2 },
    cost: { wood: 20 },
    workers: 1,
    inputs: {},
    outputs: {},
    storage: { wood: 50 },
    adjacencyBonuses: { house: 0.2 },
    allowedTerrain: [Tile.Grass],
    requiredAdjacency: ['house'],
    constructionTime: 3,
    maxLevel: 2,
  },
};

export type BuildingType = keyof typeof BUILDING_DEFINITIONS;
