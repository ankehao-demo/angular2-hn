import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { Settings } from '../types/Settings';

interface SettingsContextType {
  settings: Settings;
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: string) => void;
  setFont: (fontSize: string) => void;
  setSpacing: (listSpacing: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

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

function initTheme(): string {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  const darkColorSchemeMedia = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );
  return darkColorSchemeMedia.matches ? 'night' : 'default';
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const initial = getInitialSettings();
    initial.theme = initTheme();
    return initial;
  });

  const handleSystemPreferredColorSchemeChange = useCallback(
    (event: MediaQueryListEvent) => {
      const theme = event.matches ? 'night' : 'default';
      setSettings((prev) => {
        localStorage.setItem('theme', theme);
        return { ...prev, theme };
      });
    },
    []
  );

  useEffect(() => {
    const darkColorSchemeMedia = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    darkColorSchemeMedia.addEventListener(
      'change',
      handleSystemPreferredColorSchemeChange
    );
    return () => {
      darkColorSchemeMedia.removeEventListener(
        'change',
        handleSystemPreferredColorSchemeChange
      );
    };
  }, [handleSystemPreferredColorSchemeChange]);

  const toggleSettings = useCallback(() => {
    setSettings((prev) => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  const toggleOpenLinksInNewTab = useCallback(() => {
    setSettings((prev) => {
      const newVal = !prev.openLinkInNewTab;
      localStorage.setItem('openLinkInNewTab', JSON.stringify(newVal));
      return { ...prev, openLinkInNewTab: newVal };
    });
  }, []);

  const setTheme = useCallback((theme: string) => {
    setSettings((prev) => {
      localStorage.setItem('theme', theme);
      return { ...prev, theme };
    });
  }, []);

  const setFont = useCallback((fontSize: string) => {
    setSettings((prev) => {
      localStorage.setItem('titleFontSize', fontSize);
      return { ...prev, titleFontSize: fontSize };
    });
  }, []);

  const setSpacing = useCallback((listSpacing: string) => {
    setSettings((prev) => {
      localStorage.setItem('listSpacing', listSpacing);
      return { ...prev, listSpacing };
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
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

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
