export class Market {
    constructor() {
        this.goods = {};
    }

    registerGood(name, basePrice = 1) {
        this.goods[name] = { stock: 0, price: basePrice, demand: 0 };
    }

    request(name, qty) {
        const g = this.goods[name];
        if (!g) return 0;
        const bought = Math.min(qty, g.stock);
        g.stock -= bought;
        g.demand += qty - bought;
        return bought;
    }

    supply(name, qty) {
        const g = this.goods[name];
        if (!g) return;
        g.stock += qty;
    }

    update() {
        for (const g of Object.values(this.goods)) {
            const imbalance = g.demand - g.stock;
            g.price *= 1 + 0.05 * imbalance / Math.max(1, g.stock);
            if (g.price < 0.1) g.price = 0.1;
            g.demand = 0;
        }
    }
}

export class Economy {
    constructor() {
        this.market = new Market();
        ['food', 'wood', 'goods'].forEach(g => this.market.registerGood(g, 1));
        this.funds = 100;
        this.population = 0;
    }
}
