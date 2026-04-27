import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Settings } from '../types/settings';

type SettingsAction =
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'TOGGLE_OPEN_LINKS_IN_NEW_TAB' }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_FONT'; payload: string }
  | { type: 'SET_SPACING'; payload: string };

interface SettingsContextValue {
  settings: Settings;
  dispatch: React.Dispatch<SettingsAction>;
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: string) => void;
  setFont: (fontSize: string) => void;
  setSpacing: (listSpacing: string) => void;
}

function getInitialSettings(): Settings {
  return {
    showSettings: false,
    openLinkInNewTab: localStorage.getItem('openLinkInNewTab')
      ? JSON.parse(localStorage.getItem('openLinkInNewTab')!)
      : false,
    theme: localStorage.getItem('theme') || 'default',
    titleFontSize: localStorage.getItem('titleFontSize') || '16',
    listSpacing: localStorage.getItem('listSpacing') || '0',
  };
}

const VALID_THEMES = ['default', 'night', 'amoledblack'];

function sanitizeNumeric(value: string, fallback: string): string {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 0 || num > 100) return fallback;
  return String(num);
}

function sanitizeTheme(value: string): string {
  return VALID_THEMES.includes(value) ? value : 'default';
}

function settingsReducer(state: Settings, action: SettingsAction): Settings {
  switch (action.type) {
    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings };
    case 'TOGGLE_OPEN_LINKS_IN_NEW_TAB': {
      const newVal = !state.openLinkInNewTab;
      localStorage.setItem('openLinkInNewTab', JSON.stringify(newVal));
      return { ...state, openLinkInNewTab: newVal };
    }
    case 'SET_THEME': {
      const theme = sanitizeTheme(action.payload);
      localStorage.setItem('theme', theme);
      return { ...state, theme };
    }
    case 'SET_FONT': {
      const fontSize = sanitizeNumeric(action.payload, state.titleFontSize);
      localStorage.setItem('titleFontSize', fontSize);
      return { ...state, titleFontSize: fontSize };
    }
    case 'SET_SPACING': {
      const spacing = sanitizeNumeric(action.payload, state.listSpacing);
      localStorage.setItem('listSpacing', spacing);
      return { ...state, listSpacing: spacing };
    }
    default:
      return state;
  }
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, undefined, getInitialSettings);

  useEffect(() => {
    const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');

    if (!localStorage.getItem('theme')) {
      dispatch({ type: 'SET_THEME', payload: darkMedia.matches ? 'night' : 'default' });
    }

    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        dispatch({ type: 'SET_THEME', payload: e.matches ? 'night' : 'default' });
      }
    };

    darkMedia.addEventListener('change', handler);
    return () => darkMedia.removeEventListener('change', handler);
  }, []);

  const value: SettingsContextValue = {
    settings,
    dispatch,
    toggleSettings: () => dispatch({ type: 'TOGGLE_SETTINGS' }),
    toggleOpenLinksInNewTab: () => dispatch({ type: 'TOGGLE_OPEN_LINKS_IN_NEW_TAB' }),
    setTheme: (theme: string) => dispatch({ type: 'SET_THEME', payload: theme }),
    setFont: (fontSize: string) => dispatch({ type: 'SET_FONT', payload: fontSize }),
    setSpacing: (listSpacing: string) => dispatch({ type: 'SET_SPACING', payload: listSpacing }),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
