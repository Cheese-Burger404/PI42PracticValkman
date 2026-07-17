import { useSettings } from './SettingsContext';

export default function SettingsPanel() {
  const { settings, updateSetting, resetToDefaults } = useSettings();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    updateSetting(name, newValue);
  };

  // Стиль для одной строки настройки
  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    gap: '10px',
  };

  const labelStyle = {
    flex: '1 1 60%',
    fontSize: '14px',
  };

  const inputStyle = {
    flex: '0 0 100px',
    padding: '4px',
    textAlign: 'right',
  };

  return (
    <div style={{ background: '#f5f5dc', padding: 16, border: '1px solid #ccc', maxWidth: 400 }}>
      <h3 style={{ marginTop: 0 }}>Настройки симуляции</h3>

      {/* Змеи */}
      <div style={rowStyle}>
        <label style={labelStyle}>Макс. голод змей</label>
        <input type="number" name="snakeMaxHunger" value={settings.snakeMaxHunger} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Скорость змей</label>
        <input type="number" name="snakeSpeed" value={settings.snakeSpeed} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Обзор змей</label>
        <input type="number" name="snakeViewRadius" value={settings.snakeViewRadius} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Кулдаун размножения змей (мс)</label>
        <input type="number" name="snakeReproduceCooldown" value={settings.snakeReproduceCooldown} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Макс. змей (% от лимита)</label>
        <input type="number" step="0.05" name="snakeMaxPercent" value={settings.snakeMaxPercent} onChange={handleChange} style={inputStyle} />
      </div>

      <hr />

      {/* Кобры */}
      <div style={rowStyle}>
        <label style={labelStyle}>Макс. голод кобр</label>
        <input type="number" name="cobraMaxHunger" value={settings.cobraMaxHunger} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Обзор кобр</label>
        <input type="number" name="cobraViewRadius" value={settings.cobraViewRadius} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Кулдаун размножения кобр (мс)</label>
        <input type="number" name="cobraReproduceCooldown" value={settings.cobraReproduceCooldown} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Макс. кобр (% от лимита)</label>
        <input type="number" step="0.05" name="cobraMaxPercent" value={settings.cobraMaxPercent} onChange={handleChange} style={inputStyle} />
      </div>

      <hr />

      {/* Яблоки и общее */}
      <div style={rowStyle}>
        <label style={labelStyle}>Время жизни яблок (мс, 0=беск.)</label>
        <input type="number" name="appleLifespan" value={settings.appleLifespan} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Порог миграции змей</label>
        <input type="number" name="snakeMigrationThreshold" value={settings.snakeMigrationThreshold} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Миграция змей (кол-во)</label>
        <input type="number" name="snakeMigrationAmount" value={settings.snakeMigrationAmount} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Порог миграции кобр</label>
        <input type="number" name="cobraMigrationThreshold" value={settings.cobraMigrationThreshold} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Миграция кобр (кол-во)</label>
        <input type="number" name="cobraMigrationAmount" value={settings.cobraMigrationAmount} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <button onClick={resetToDefaults}>Сброс по умолчанию</button>
      </div>
    </div>
  );
}