import { useState, useEffect, type ReactNode } from 'react';
import { Settings } from '../models/settings';
import { SettingsContext } from './settingsContextDef';

const defaultSettings: Settings = {
  showSettings: false,
  openLinkInNewTab: localStorage.getItem('openLinkInNewTab')
    ? JSON.parse(localStorage.getItem('openLinkInNewTab')!)
    : false,
  theme: 'default',
  titleFontSize: localStorage.getItem('titleFontSize') ?? '16',
  listSpacing: localStorage.getItem('listSpacing') ?? '0',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return { ...defaultSettings, theme: savedTheme };
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { ...defaultSettings, theme: prefersDark ? 'night' : 'default' };
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setSettings((prev) => ({
          ...prev,
          theme: event.matches ? 'night' : 'default',
        }));
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleSettings = () => {
    setSettings((prev) => ({ ...prev, showSettings: !prev.showSettings }));
  };

  const toggleOpenLinksInNewTab = () => {
    setSettings((prev) => {
      const newValue = !prev.openLinkInNewTab;
      localStorage.setItem('openLinkInNewTab', JSON.stringify(newValue));
      return { ...prev, openLinkInNewTab: newValue };
    });
  };

  const setTheme = (theme: string) => {
    setSettings((prev) => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
  };

  const setFont = (fontSize: string) => {
    setSettings((prev) => ({ ...prev, titleFontSize: fontSize }));
    localStorage.setItem('titleFontSize', fontSize);
  };

  const setSpacing = (listSpace: string) => {
    setSettings((prev) => ({ ...prev, listSpacing: listSpace }));
    localStorage.setItem('listSpacing', listSpace);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
