import { BuildingDefinition } from './definitions';

export enum BuildingState {
  Construction,
  Active,
  Upgrading,
}

export class Building {
  level = 0;
  progress = 0; // ticks spent in current state
  state: BuildingState = BuildingState.Construction;

  constructor(public def: BuildingDefinition, public x: number, public y: number) {}

  update(): void {
    if (this.state === BuildingState.Construction) {
      this.progress++;
      if (this.progress >= this.def.constructionTime) {
        this.state = BuildingState.Active;
        this.level = 1;
        this.progress = 0;
      }
    } else if (this.state === BuildingState.Upgrading) {
      this.progress++;
      if (this.progress >= this.def.constructionTime) {
        this.state = BuildingState.Active;
        this.level++;
        this.progress = 0;
      }
    }
  }

  startUpgrade(): boolean {
    if (this.state === BuildingState.Active && this.level < this.def.maxLevel) {
      this.state = BuildingState.Upgrading;
      this.progress = 0;
      return true;
    }
    return false;
  }

  /** Current animation frame for construction/upgrade visuals. */
  get animationFrame(): number {
    const frames = this.def.constructionTime;
    if (this.state === BuildingState.Active) {
      return frames - 1;
    }
    return Math.min(frames - 1, Math.floor((this.progress / frames) * frames));
  }
}
