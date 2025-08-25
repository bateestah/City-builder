import { Game } from './core/game';

function bootstrap() {
  const root = document.getElementById('app') ?? document.body;
  const canvas = document.createElement('canvas');
  root.appendChild(canvas);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');

  const game = new Game(ctx);

  // input handlers
  canvas.addEventListener('click', (e) =>
    game.handleClick(e.offsetX, e.offsetY)
  );
  canvas.addEventListener('mousedown', (e) =>
    game.handleMouseDown(e.clientX, e.clientY)
  );
  window.addEventListener('mousemove', (e) =>
    game.handleMouseMove(e.clientX, e.clientY)
  );
  window.addEventListener('mouseup', () => game.handleMouseUp());
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    game.handleWheel(e.deltaY);
  });

  function loop() {
    game.render();
    requestAnimationFrame(loop);
  }
  loop();
}

bootstrap();
