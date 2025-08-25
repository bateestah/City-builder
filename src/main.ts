import { Game } from './core/game';

function bootstrap() {
  const canvas = document.createElement('canvas');
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');

  new Game(ctx);
}

bootstrap();
