import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Settings } from '../types';

interface SettingsContextType {
  settings: Settings;
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: string) => void;
  setFont: (fontSize: string) => void;
  setSpacing: (listSpace: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedOpenLink = localStorage.getItem('openLinkInNewTab');
    const savedTheme = localStorage.getItem('theme');
    const savedFontSize = localStorage.getItem('titleFontSize');
    const savedSpacing = localStorage.getItem('listSpacing');

    // Initialize theme from system preference if no saved theme
    let theme = savedTheme || 'default';
    if (!savedTheme && typeof window !== 'undefined' && window.matchMedia) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'default';
    }

    return {
      showSettings: false,
      openLinkInNewTab: savedOpenLink ? JSON.parse(savedOpenLink) : false,
      theme,
      titleFontSize: savedFontSize || '16',
      listSpacing: savedSpacing || '0',
    };
  });

  const handleSystemPreferredColorSchemeChange = useCallback((event: MediaQueryListEvent) => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      const theme = event.matches ? 'night' : 'default';
      setSettings(prev => ({ ...prev, theme }));
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
    localStorage.setItem('theme', theme);
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  const setFont = useCallback((fontSize: string) => {
    localStorage.setItem('titleFontSize', fontSize);
    setSettings(prev => ({ ...prev, titleFontSize: fontSize }));
  }, []);

  const setSpacing = useCallback((listSpace: string) => {
    localStorage.setItem('listSpacing', listSpace);
    setSettings(prev => ({ ...prev, listSpacing: listSpace }));
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
