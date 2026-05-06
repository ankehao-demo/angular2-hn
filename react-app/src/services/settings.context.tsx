import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Settings } from '../models/settings';

interface SettingsContextType {
  settings: Settings;
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: string) => void;
  setFont: (fontSize: string) => void;
  setSpacing: (listSpace: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function getInitialSettings(): Settings {
  const darkColorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');
  let theme = 'default';
  if (savedTheme) {
    theme = savedTheme;
  } else if (darkColorSchemeMedia.matches) {
    theme = 'night';
  }

  return {
    showSettings: false,
    openLinkInNewTab: localStorage.getItem('openLinkInNewTab')
      ? JSON.parse(localStorage.getItem('openLinkInNewTab')!)
      : false,
    theme,
    titleFontSize: localStorage.getItem('titleFontSize') || '16',
    listSpacing: localStorage.getItem('listSpacing') || '0',
  };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);

  const handleSystemPreferredColorSchemeChange = useCallback((event: MediaQueryListEvent) => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      const newTheme = event.matches ? 'night' : 'default';
      setSettings(prev => ({ ...prev, theme: newTheme }));
      localStorage.setItem('theme', newTheme);
    }
  }, []);

  useEffect(() => {
    const darkColorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    darkColorSchemeMedia.addEventListener('change', handleSystemPreferredColorSchemeChange);
    return () => {
      darkColorSchemeMedia.removeEventListener('change', handleSystemPreferredColorSchemeChange);
    };
  }, [handleSystemPreferredColorSchemeChange]);

  const toggleSettings = useCallback(() => {
    setSettings(prev => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  const toggleOpenLinksInNewTab = useCallback(() => {
    setSettings(prev => {
      const newVal = !prev.openLinkInNewTab;
      localStorage.setItem('openLinkInNewTab', JSON.stringify(newVal));
      return { ...prev, openLinkInNewTab: newVal };
    });
  }, []);

  const setTheme = useCallback((theme: string) => {
    const validThemes = ['default', 'night', 'amoledblack'];
    const safeTheme = validThemes.includes(theme) ? theme : 'default';
    setSettings(prev => ({ ...prev, theme: safeTheme }));
    localStorage.setItem('theme', safeTheme);
  }, []);

  const setFont = useCallback((fontSize: string) => {
    const parsed = parseInt(fontSize, 10);
    const safeFontSize = String(isNaN(parsed) ? 16 : Math.max(1, Math.min(100, parsed)));
    setSettings(prev => ({ ...prev, titleFontSize: safeFontSize }));
    localStorage.setItem('titleFontSize', safeFontSize);
  }, []);

  const setSpacing = useCallback((listSpace: string) => {
    const parsed = parseInt(listSpace, 10);
    const safeSpacing = String(isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed)));
    setSettings(prev => ({ ...prev, listSpacing: safeSpacing }));
    localStorage.setItem('listSpacing', safeSpacing);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
