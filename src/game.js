import { drawTile, isoToScreen, TILE_WIDTH, TILE_HEIGHT } from './isometric.js';
import { Farm, House, LumberMill, Factory } from './buildings.js';
import { Economy } from './economy.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.offsetX = canvas.width / 2;
        this.offsetY = 50;
        this.mapSize = 10;
        this.buildings = [];
        this.economy = new Economy();
        this.selected = Farm;
        canvas.addEventListener('click', e => this.handleClick(e));
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left - this.offsetX;
        const my = e.clientY - rect.top - this.offsetY;
        const y = Math.floor((mx / (TILE_WIDTH / 2) + my / (TILE_HEIGHT / 2)) / 2);
        const x = Math.floor((my / (TILE_HEIGHT / 2) - mx / (TILE_WIDTH / 2)) / 2);
        if (x >= 0 && y >= 0 && x < this.mapSize && y < this.mapSize) {
            this.buildings.push(new this.selected(x, y));
        }
    }

    update() {
        this.buildings.forEach(b => b.update(this.economy));
        this.economy.market.update();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        for (let y = 0; y < this.mapSize; y++) {
            for (let x = 0; x < this.mapSize; x++) {
                drawTile(this.ctx, x, y, '#3d9943');
            }
        }
        this.buildings.forEach(b => b.draw(this.ctx));
        this.ctx.restore();
    }
}

export const buildingTypes = { Farm, House, LumberMill, Factory };
