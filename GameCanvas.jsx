import { useEffect, useRef } from 'react';
import { GameEngine } from '../core/game.js';

function GameCanvas({ isPaused, onStateChange, settings  }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    gameRef.current = new GameEngine(canvasRef.current, (stats) => {
      onStateChange?.(stats);
    });
    gameRef.current.start();
    return () => gameRef.current.stop();
  }, []);
   useEffect(() => {
    if (gameRef.current) {
      gameRef.current.updateSettings(settings);
    }
  }, [settings]);
  useEffect(() => {
    if (!gameRef.current) return;
    if (isPaused) gameRef.current.pause();
    else gameRef.current.resume();
  }, [isPaused]);

	
  return <canvas ref={canvasRef} id="gameCanvas" width={800} height={600} />;
}

export default GameCanvas;