import { SettingsProvider } from './components/SettingsContext';
import GamePage from './components/GamePage';

function App() {
  return (
    <SettingsProvider>
      <GamePage />
    </SettingsProvider>
  );
}
export default App;