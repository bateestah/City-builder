import { Game, buildingTypes } from './game.js';

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

const ui = document.getElementById('ui');
for (const [name, cls] of Object.entries(buildingTypes)) {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.onclick = () => game.selected = cls;
    ui.appendChild(btn);
}
const info = document.createElement('div');
ui.appendChild(info);

function loop() {
    game.update();
    game.draw();
    const goods = game.economy.market.goods;
    info.innerHTML = `Funds: ${game.economy.funds.toFixed(1)}<br>
    Pop: ${game.economy.population.toFixed(1)}<br>
    Food: ${goods.food.stock.toFixed(1)} (p: ${goods.food.price.toFixed(2)})<br>
    Wood: ${goods.wood.stock.toFixed(1)} (p: ${goods.wood.price.toFixed(2)})<br>
    Goods: ${goods.goods.stock.toFixed(1)} (p: ${goods.goods.price.toFixed(2)})`;
    requestAnimationFrame(loop);
}
loop();
