import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Settings } from '../types/settings';

interface SettingsContextType extends Settings {
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: string) => void;
  setFont: (fontSize: string) => void;
  setSpacing: (listSpace: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showSettings, setShowSettings] = useState(false);
  const [openLinkInNewTab, setOpenLinkInNewTab] = useState(() => {
    const saved = localStorage.getItem('openLinkInNewTab');
    return saved ? JSON.parse(saved) : false;
  });
    const [theme, setThemeState] = useState(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'night';
      }
      return 'default';
    });
    const [titleFontSize, setTitleFontSize] = useState(() => {
      return localStorage.getItem('titleFontSize') || '16';
    });
    const [listSpacing, setListSpacing] = useState(() => {
      return localStorage.getItem('listSpacing') || '0';
    });

    const setTheme = useCallback((newTheme: string) => {
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);
    }, []);

  useEffect(() => {
    const darkColorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'night' : 'default');
    };
    darkColorSchemeMedia.addEventListener('change', handler);
    return () => darkColorSchemeMedia.removeEventListener('change', handler);
  }, [setTheme]);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const toggleOpenLinksInNewTab = useCallback(() => {
    setOpenLinkInNewTab((prev: boolean) => {
      const newVal = !prev;
      localStorage.setItem('openLinkInNewTab', JSON.stringify(newVal));
      return newVal;
    });
  }, []);

  const setFont = useCallback((fontSize: string) => {
    setTitleFontSize(fontSize);
    localStorage.setItem('titleFontSize', fontSize);
  }, []);

  const setSpacing = useCallback((listSpace: string) => {
    setListSpacing(listSpace);
    localStorage.setItem('listSpacing', listSpace);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        showSettings,
        openLinkInNewTab,
        theme,
        titleFontSize,
        listSpacing,
        toggleSettings,
        toggleOpenLinksInNewTab,
        setTheme,
        setFont,
        setSpacing,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
