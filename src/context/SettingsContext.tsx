import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Settings } from '../types/settings';

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
    const stored = localStorage.getItem('openLinkInNewTab');
    return stored ? JSON.parse(stored) : false;
  });
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('theme') || '';
  });
  const [titleFontSize, setTitleFontSize] = useState(() => {
    return localStorage.getItem('titleFontSize') || '16';
  });
  const [listSpacing, setListSpacing] = useState(() => {
    return localStorage.getItem('listSpacing') || '0';
  });

  // Listen to system preferred color scheme
  useEffect(() => {
    const darkColorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      const newTheme = event.matches ? 'night' : 'default';
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);
    };

    // Initialize theme if not saved
    if (!localStorage.getItem('theme')) {
      const initialTheme = darkColorSchemeMedia.matches ? 'night' : 'default';
      setThemeState(initialTheme);
    }

    darkColorSchemeMedia.addEventListener('change', handleChange);
    return () => darkColorSchemeMedia.removeEventListener('change', handleChange);
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings((prev) => !prev);
  }, []);

  const toggleOpenLinksInNewTab = useCallback(() => {
    setOpenLinkInNewTab((prev: boolean) => {
      const next = !prev;
      localStorage.setItem('openLinkInNewTab', JSON.stringify(next));
      return next;
    });
  }, []);

  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
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

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
