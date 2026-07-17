import { useState, useEffect, useRef } from 'react';
import GameCanvas from '../components/GameCanvas';
import StatsGraph from '../components/StatsGraph';
import SettingsPanel from '../components/SettingsPanel';
import { useSettings } from '../components/SettingsContext';

function GamePage() {
  const [paused, setPaused] = useState(true);
  const [stats, setStats] = useState({ snakes: 0, cobras: 0, apples: 0 });
  const [restartKey, setRestartKey] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);
  const pausedRef = useRef(paused);
  const { settings } = useSettings();

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const handleStateChange = (newStats) => {
    setStats(newStats);
    if (!pausedRef.current) {
      const point = { time: Date.now(), ...newStats };
      historyRef.current = [...historyRef.current.slice(-300), point];
      setHistory([...historyRef.current]);
    }
  };
  const handleOpenAbout = () => {
    setShowAbout(true);
    setPaused(true);
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
    setPaused(false);
  };

  const handleRestart = () => {
    setRestartKey(prev => prev + 1);
    setPaused(true);
    setShowAbout(false);
    setShowSettings(false);
    setHistory([]);
    historyRef.current = [];
  };

  const togglePause = () => setPaused(prev => !prev);

  return (
    <div>
      <h2>Жестокие змеи</h2>
      <div>
        🐍 Змеи: {stats.snakes} | 🐉 Кобры: {stats.cobras} | 🍎 Яблоки: {stats.apples}
      </div>
      <div style={{ margin: '10px 0' }}>
        <button onClick={togglePause}>{paused ? '▶ Продолжить' : '⏸ Пауза'}</button>
        <button onClick={handleRestart}>↺ Перезапуск</button>
        <button onClick={handleOpenAbout}>О нас</button>
        <button onClick={() => setShowSettings(true)}>⚙️ Настройки</button>
      </div>

      <GameCanvas
        key={restartKey}
        isPaused={paused}
        onStateChange={handleStateChange}
        settings={settings}
      />
      <StatsGraph history={history} />

      {showAbout && (
         <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            border: '2px solid black',
            zIndex: 1000,
          }}
        >
          <h3>О проекте</h3>
          <p>Это симуляция «Жестокие змеи» – змеи едят яблоки и размножаются,
            кобры охотятся на змей, а иногда становятся каннибалами.</p>
         <button onClick={handleCloseAbout}>Закрыть</button>
        </div>
      )}

      {showSettings && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#f5f5dc',
          padding: 20,
          border: '2px solid #333',
          zIndex: 1000,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <SettingsPanel />
          <button onClick={() => setShowSettings(false)}>Закрыть</button>
        </div>
      )}
    </div>
  );
}

export default GamePage;