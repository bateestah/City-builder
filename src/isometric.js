export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

export function isoToScreen(x, y) {
    return {
        x: (x - y) * TILE_WIDTH / 2,
        y: (x + y) * TILE_HEIGHT / 2
    };
}

export function drawTile(ctx, x, y, color) {
    const p = isoToScreen(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + TILE_WIDTH / 2, p.y + TILE_HEIGHT / 2);
    ctx.lineTo(p.x, p.y + TILE_HEIGHT);
    ctx.lineTo(p.x - TILE_WIDTH / 2, p.y + TILE_HEIGHT / 2);
    ctx.closePath();
    ctx.fill();
}
