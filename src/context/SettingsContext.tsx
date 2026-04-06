import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type Settings } from '../models/settings';

interface SettingsContextValue extends Settings {
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: string) => void;
  setFont: (size: string) => void;
  setSpacing: (spacing: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

function getInitialSettings(): Settings {
  const openLinkInNewTab = localStorage.getItem('openLinkInNewTab') === 'true';
  const theme = localStorage.getItem('theme') || 'default';
  const titleFontSize = localStorage.getItem('titleFontSize') || '16';
  const listSpacing = localStorage.getItem('listSpacing') || '0';

  return {
    showSettings: false,
    openLinkInNewTab,
    theme,
    titleFontSize,
    listSpacing,
  };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && settings.theme === 'default') {
        setSettings((prev) => ({ ...prev, theme: 'night' }));
        localStorage.setItem('theme', 'night');
      }
    };

    if (darkModeMediaQuery.matches && !localStorage.getItem('theme')) {
      setSettings((prev) => ({ ...prev, theme: 'night' }));
      localStorage.setItem('theme', 'night');
    }

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  const toggleSettings = useCallback(() => {
    setSettings((prev) => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  const toggleOpenLinksInNewTab = useCallback(() => {
    setSettings((prev) => {
      const newVal = !prev.openLinkInNewTab;
      localStorage.setItem('openLinkInNewTab', String(newVal));
      return { ...prev, openLinkInNewTab: newVal };
    });
  }, []);

  const setTheme = useCallback((theme: string) => {
    setSettings((prev) => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
  }, []);

  const setFont = useCallback((titleFontSize: string) => {
    setSettings((prev) => ({ ...prev, titleFontSize }));
    localStorage.setItem('titleFontSize', titleFontSize);
  }, []);

  const setSpacing = useCallback((listSpacing: string) => {
    setSettings((prev) => ({ ...prev, listSpacing }));
    localStorage.setItem('listSpacing', listSpacing);
  }, []);

  const value: SettingsContextValue = {
    ...settings,
    toggleSettings,
    toggleOpenLinksInNewTab,
    setTheme,
    setFont,
    setSpacing,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
