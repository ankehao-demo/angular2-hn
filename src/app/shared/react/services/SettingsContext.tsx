import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Settings } from '../models/settings';

function getInitialSettings(): Settings {
  return {
    showSettings: false,
    openLinkInNewTab: localStorage.getItem('openLinkInNewTab')
      ? JSON.parse(localStorage.getItem('openLinkInNewTab')!)
      : false,
    theme: 'default',
    titleFontSize: localStorage.getItem('titleFontSize') ?? '16',
    listSpacing: localStorage.getItem('listSpacing') ?? '0',
  };
}

interface SettingsContextValue {
  settings: Settings;
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: string) => void;
  setFont: (fontSize: string) => void;
  setSpacing: (listSpace: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

/**
 * SettingsProvider replaces Angular's SettingsService (@Injectable providedIn: 'root').
 *
 * Wrap your app (or the relevant subtree) with <SettingsProvider> to provide
 * settings state and mutators to all descendants via useSettings().
 */
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);
  const darkColorSchemeMedia = useRef<MediaQueryList>(window.matchMedia('(prefers-color-scheme: dark)'));

  const setTheme = useCallback((theme: string) => {
    setSettings((prev) => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
  }, []);

  // Subscribe to system preferred color scheme changes
  useEffect(() => {
    const mediaQuery = darkColorSchemeMedia.current;

    const handleChange = (event: MediaQueryListEvent) => {
      const theme = event.matches ? 'night' : 'default';
      setTheme(theme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setTheme]);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setSettings((prev) => ({ ...prev, theme: savedTheme }));
    } else {
      const mediaQuery = darkColorSchemeMedia.current;
      const theme = mediaQuery.matches ? 'night' : 'default';
      setTheme(theme);
    }
  }, [setTheme]);

  const toggleSettings = useCallback(() => {
    setSettings((prev) => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  const toggleOpenLinksInNewTab = useCallback(() => {
    setSettings((prev) => {
      const newValue = !prev.openLinkInNewTab;
      localStorage.setItem('openLinkInNewTab', JSON.stringify(newValue));
      return { ...prev, openLinkInNewTab: newValue };
    });
  }, []);

  const setFont = useCallback((fontSize: string) => {
    setSettings((prev) => ({ ...prev, titleFontSize: fontSize }));
    localStorage.setItem('titleFontSize', fontSize);
  }, []);

  const setSpacing = useCallback((listSpace: string) => {
    setSettings((prev) => ({ ...prev, listSpacing: listSpace }));
    localStorage.setItem('listSpacing', listSpace);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * useSettings hook — replaces injecting SettingsService in Angular components.
 *
 * Must be used within a <SettingsProvider>.
 */
export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
