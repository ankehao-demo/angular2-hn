import { useState, useEffect, useCallback } from 'react';

/**
 * Settings interface — mirrors the Angular Settings model
 * (src/app/shared/models/settings.ts)
 */
export interface Settings {
  showSettings: boolean;
  openLinkInNewTab: boolean;
  theme: string;
  titleFontSize: string;
  listSpacing: string;
}

/**
 * Module-level settings object that acts as the singleton state,
 * mirroring the Angular SettingsService which is providedIn: 'root'.
 */
const initialSettings: Settings = {
  showSettings: false,
  openLinkInNewTab: localStorage.getItem('openLinkInNewTab')
    ? JSON.parse(localStorage.getItem('openLinkInNewTab') as string)
    : false,
  theme: 'default',
  titleFontSize: localStorage.getItem('titleFontSize') || '16',
  listSpacing: localStorage.getItem('listSpacing') || '0',
};

/** Shared mutable reference so all hook instances share the same state */
let sharedSettings: Settings = { ...initialSettings };

/** Listeners that get notified when settings change */
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

/**
 * Initialize the theme based on localStorage or system preference.
 * Mirrors SettingsService.initTheme() and subscribeToSystemPreferredColorScheme().
 */
function initTheme(): void {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    sharedSettings.theme = savedTheme;
  } else {
    const darkColorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    sharedSettings.theme = darkColorSchemeMedia.matches ? 'night' : 'default';
  }
}

// Run theme initialization once on module load
initTheme();

/**
 * useSettings — React hook equivalent of SettingsService.
 *
 * Returns the current settings object and action methods.
 * All consumers share the same underlying state.
 */
export function useSettings() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Listen for system color scheme changes (mirrors subscribeToSystemPreferredColorScheme)
  useEffect(() => {
    const darkColorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      const theme = event.matches ? 'night' : 'default';
      sharedSettings = { ...sharedSettings, theme };
      localStorage.setItem('theme', theme);
      notifyListeners();
    };
    darkColorSchemeMedia.addEventListener('change', handleChange);
    return () => {
      darkColorSchemeMedia.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleSettings = useCallback(() => {
    sharedSettings = {
      ...sharedSettings,
      showSettings: !sharedSettings.showSettings,
    };
    notifyListeners();
  }, []);

  const toggleOpenLinksInNewTab = useCallback(() => {
    const newValue = !sharedSettings.openLinkInNewTab;
    sharedSettings = { ...sharedSettings, openLinkInNewTab: newValue };
    localStorage.setItem('openLinkInNewTab', JSON.stringify(newValue));
    notifyListeners();
  }, []);

  const setTheme = useCallback((theme: string) => {
    sharedSettings = { ...sharedSettings, theme };
    localStorage.setItem('theme', theme);
    notifyListeners();
  }, []);

  const setFont = useCallback((fontSize: string) => {
    sharedSettings = { ...sharedSettings, titleFontSize: fontSize };
    localStorage.setItem('titleFontSize', fontSize);
    notifyListeners();
  }, []);

  const setSpacing = useCallback((listSpace: string) => {
    sharedSettings = { ...sharedSettings, listSpacing: listSpace };
    localStorage.setItem('listSpacing', listSpace);
    notifyListeners();
  }, []);

  return {
    settings: sharedSettings,
    toggleSettings,
    toggleOpenLinksInNewTab,
    setTheme,
    setFont,
    setSpacing,
  };
}
