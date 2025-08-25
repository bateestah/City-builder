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

  new Game(ctx);
}

bootstrap();
