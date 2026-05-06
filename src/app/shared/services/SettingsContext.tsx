import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Settings } from '../models/settings';

interface SettingsContextType {
  settings: Settings;
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: string) => void;
  setFont: (fontSize: string) => void;
  setSpacing: (listSpace: string) => void;
}

const defaultSettings: Settings = {
  showSettings: false,
  openLinkInNewTab: typeof window !== 'undefined' && localStorage.getItem('openLinkInNewTab')
    ? JSON.parse(localStorage.getItem('openLinkInNewTab')!)
    : false,
  theme: 'default',
  titleFontSize: typeof window !== 'undefined' && localStorage.getItem('titleFontSize')
    ? localStorage.getItem('titleFontSize')!
    : '16',
  listSpacing: typeof window !== 'undefined' && localStorage.getItem('listSpacing')
    ? localStorage.getItem('listSpacing')!
    : '0',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const listenerRef = useRef<((e: MediaQueryListEvent) => void) | null>(null);

  const setTheme = useCallback((theme: string) => {
    setSettings(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setSettings(prev => ({ ...prev, theme: savedTheme }));
    } else {
      const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (darkMedia.matches) {
        setTheme('night');
      }
    }
  }, [setTheme]);

  useEffect(() => {
    const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'night' : 'default');
    };
    listenerRef.current = handler;
    darkMedia.addEventListener('change', handler);
    return () => {
      darkMedia.removeEventListener('change', handler);
    };
  }, [setTheme]);

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

  const setFont = useCallback((fontSize: string) => {
    setSettings(prev => ({ ...prev, titleFontSize: fontSize }));
    localStorage.setItem('titleFontSize', fontSize);
  }, []);

  const setSpacing = useCallback((listSpace: string) => {
    setSettings(prev => ({ ...prev, listSpacing: listSpace }));
    localStorage.setItem('listSpacing', listSpace);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing }}>
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
