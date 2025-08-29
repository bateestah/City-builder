import { drawTile } from './isometric.js';

export class Building {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = '#ccc';
    }

    update(economy) {}

    draw(ctx) {
        drawTile(ctx, this.x, this.y, this.color);
    }
}

export class Farm extends Building {
    constructor(x, y) {
        super(x, y);
        this.color = '#3a3';
    }
    update(economy) {
        economy.market.supply('food', 1);
    }
}

export class House extends Building {
    constructor(x, y) {
        super(x, y);
        this.color = '#a33';
    }
    update(economy) {
        const food = economy.market.request('food', 1);
        if (food === 1) {
            economy.population += 0.01;
            economy.funds += 1;
        } else {
            economy.population = Math.max(0, economy.population - 0.01);
        }
    }
}

export class LumberMill extends Building {
    constructor(x, y) {
        super(x, y);
        this.color = '#964B00';
    }
    update(economy) {
        economy.market.supply('wood', 1);
    }
}

export class Factory extends Building {
    constructor(x, y) {
        super(x, y);
        this.color = '#555';
    }
    update(economy) {
        const wood = economy.market.request('wood', 1);
        if (wood === 1) {
            economy.market.supply('goods', 1);
        }
    }
}
