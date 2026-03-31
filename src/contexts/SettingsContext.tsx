import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  showSettings: false,
  openLinkInNewTab: false,
  theme: 'default',
  titleFontSize: 'medium',
  listSpacing: 'normal',
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  toggleSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  toggleSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem('hn-settings');
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }

  // Detect system dark mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return { ...DEFAULT_SETTINGS, theme: 'dark' };
  }

  return DEFAULT_SETTINGS;
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    localStorage.setItem('hn-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleSettings = useCallback(() => {
    setSettings(prev => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
