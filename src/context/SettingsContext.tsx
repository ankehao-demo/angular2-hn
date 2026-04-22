import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Settings, ThemeName } from '../types/settings';

const STORAGE_KEYS = {
  openLinkInNewTab: 'open-new-tab',
  titleFontSize: 'font-size',
  listSpacing: 'list-spacing',
  theme: 'theme',
} as const;

const VALID_THEMES: readonly ThemeName[] = ['default', 'night', 'amoledblack'];

function toValidTheme(value: string): ThemeName {
  return VALID_THEMES.includes(value as ThemeName)
    ? (value as ThemeName)
    : 'default';
}

function toValidPixelSize(value: string, fallback: string): string {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 8 || parsed > 64) return fallback;
  return String(parsed);
}

function loadInitialSettings(): Settings {
  const storedTheme = typeof window !== 'undefined'
    ? (localStorage.getItem(STORAGE_KEYS.theme) as ThemeName | null)
    : null;
  const systemPrefersDark = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const theme: ThemeName = storedTheme
    ?? (systemPrefersDark ? 'night' : 'default');

  const openLinkInNewTab = typeof window !== 'undefined'
    && localStorage.getItem(STORAGE_KEYS.openLinkInNewTab) === 'true';

  const titleFontSize = (typeof window !== 'undefined'
    && localStorage.getItem(STORAGE_KEYS.titleFontSize)) || '14';

  const listSpacing = (typeof window !== 'undefined'
    && localStorage.getItem(STORAGE_KEYS.listSpacing)) || '10';

  return {
    showSettings: false,
    openLinkInNewTab,
    theme,
    titleFontSize,
    listSpacing,
  };
}

interface SettingsContextValue {
  settings: Settings;
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: ThemeName) => void;
  setFont: (fontSize: string) => void;
  setSpacing: (listSpace: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => loadInitialSettings());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (storedTheme) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      setSettings((prev) =>
        prev.theme === (event.matches ? 'night' : 'default')
          ? prev
          : { ...prev, theme: event.matches ? 'night' : 'default' }
      );
    };
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, []);

  const toggleSettings = useCallback(() => {
    setSettings((prev) => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  const toggleOpenLinksInNewTab = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.openLinkInNewTab;
      localStorage.setItem(STORAGE_KEYS.openLinkInNewTab, String(next));
      return { ...prev, openLinkInNewTab: next };
    });
  }, []);

  const setTheme = useCallback((theme: ThemeName) => {
    const safeTheme = toValidTheme(theme);
    localStorage.setItem(STORAGE_KEYS.theme, safeTheme);
    setSettings((prev) => ({ ...prev, theme: safeTheme }));
  }, []);

  const setFont = useCallback((fontSize: string) => {
    const safeFontSize = toValidPixelSize(fontSize, '14');
    localStorage.setItem(STORAGE_KEYS.titleFontSize, safeFontSize);
    setSettings((prev) => ({ ...prev, titleFontSize: safeFontSize }));
  }, []);

  const setSpacing = useCallback((listSpace: string) => {
    const safeSpacing = toValidPixelSize(listSpace, '10');
    localStorage.setItem(STORAGE_KEYS.listSpacing, safeSpacing);
    setSettings((prev) => ({ ...prev, listSpacing: safeSpacing }));
  }, []);

  const value = useMemo(
    () => ({
      settings,
      toggleSettings,
      toggleOpenLinksInNewTab,
      setTheme,
      setFont,
      setSpacing,
    }),
    [settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
