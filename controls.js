// src/ui/controls.js

export function setupControls(gameInstance) {
  const pauseBtn = document.getElementById('pauseButton');
  const restartBtn = document.getElementById('restartButton');

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (gameInstance.isPaused) {
        gameInstance.resume();
        pauseBtn.textContent = 'Пауза';
      } else {
        gameInstance.pause();
        pauseBtn.textContent = 'Продолжить';
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      gameInstance.restart();
      if (pauseBtn) pauseBtn.textContent = 'Пауза';
    });
  }
}