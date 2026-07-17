import { createContext, useContext, useState } from 'react';
import { settings as defaultSettings } from '..//core/settings';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => setSettings(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetToDefaults }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);