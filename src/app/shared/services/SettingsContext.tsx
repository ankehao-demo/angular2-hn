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

function sanitizeNumericString(value: string | null, fallback: string): string {
  if (value === null) return fallback;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? String(num) : fallback;
}

function sanitizeBoolean(value: string | null, fallback: boolean): boolean {
  if (value === null) return fallback;
  return value === 'true';
}

const VALID_THEMES = ['default', 'night', 'amoledblack'] as const;

function sanitizeTheme(value: string | null): string {
  if (value && (VALID_THEMES as readonly string[]).includes(value)) return value;
  return 'default';
}

const defaultSettings: Settings = {
  showSettings: false,
  openLinkInNewTab: typeof window !== 'undefined'
    ? sanitizeBoolean(localStorage.getItem('openLinkInNewTab'), false)
    : false,
  theme: 'default',
  titleFontSize: typeof window !== 'undefined'
    ? sanitizeNumericString(localStorage.getItem('titleFontSize'), '16')
    : '16',
  listSpacing: typeof window !== 'undefined'
    ? sanitizeNumericString(localStorage.getItem('listSpacing'), '0')
    : '0',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const listenerRef = useRef<((e: MediaQueryListEvent) => void) | null>(null);

  const setTheme = useCallback((theme: string) => {
    const validated = sanitizeTheme(theme);
    setSettings(prev => ({ ...prev, theme: validated }));
    localStorage.setItem('theme', validated);
  }, []);

  useEffect(() => {
    const savedTheme = sanitizeTheme(localStorage.getItem('theme'));
    if (savedTheme !== 'default') {
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
    const sanitized = sanitizeNumericString(fontSize, '16');
    setSettings(prev => ({ ...prev, titleFontSize: sanitized }));
    localStorage.setItem('titleFontSize', sanitized);
  }, []);

  const setSpacing = useCallback((listSpace: string) => {
    const sanitized = sanitizeNumericString(listSpace, '0');
    setSettings(prev => ({ ...prev, listSpacing: sanitized }));
    localStorage.setItem('listSpacing', sanitized);
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
