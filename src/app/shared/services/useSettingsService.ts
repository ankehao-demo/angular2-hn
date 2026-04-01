import { useState, useEffect, useCallback } from 'react';

/**
 * Settings interface mirroring the Angular Settings model.
 * @see src/app/shared/models/settings.ts
 */
export interface Settings {
  showSettings: boolean;
  openLinkInNewTab: boolean;
  theme: string;
  titleFontSize: string;
  listSpacing: string;
}

/**
 * React hook that mirrors the Angular SettingsService.
 *
 * Manages application settings state with localStorage persistence,
 * and listens for system dark-mode preference changes.
 *
 * @see src/app/shared/services/settings.service.ts (Angular original)
 */
export function useSettingsService() {
  const [settings, setSettings] = useState<Settings>(() => {
    const openLinkRaw = localStorage.getItem('openLinkInNewTab');
    return {
      showSettings: false,
      openLinkInNewTab: openLinkRaw ? JSON.parse(openLinkRaw) : false,
      theme: 'default',
      titleFontSize: localStorage.getItem('titleFontSize') || '16',
      listSpacing: localStorage.getItem('listSpacing') || '0',
    };
  });

  // Initialize theme from localStorage or system preference (mirrors initTheme)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setSettings((prev) => ({ ...prev, theme: savedTheme }));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'night' : 'default';
      setSettings((prev) => ({ ...prev, theme: systemTheme }));
      localStorage.setItem('theme', systemTheme);
    }
  }, []);

  // Subscribe to system color scheme changes (mirrors subscribeToSystemPreferredColorScheme)
  useEffect(() => {
    const darkColorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      const theme = event.matches ? 'night' : 'default';
      setSettings((prev) => ({ ...prev, theme }));
      localStorage.setItem('theme', theme);
    };

    darkColorSchemeMedia.addEventListener('change', handleChange);

    // Cleanup mirrors ngOnDestroy / unSubscribeToSystemPrefferedColorScheme
    return () => {
      darkColorSchemeMedia.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleSettings = useCallback(() => {
    setSettings((prev) => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  const toggleOpenLinksInNewTab = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.openLinkInNewTab;
      localStorage.setItem('openLinkInNewTab', JSON.stringify(next));
      return { ...prev, openLinkInNewTab: next };
    });
  }, []);

  const setTheme = useCallback((theme: string) => {
    setSettings((prev) => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
  }, []);

  const setFont = useCallback((fontSize: string) => {
    setSettings((prev) => ({ ...prev, titleFontSize: fontSize }));
    localStorage.setItem('titleFontSize', fontSize);
  }, []);

  const setSpacing = useCallback((listSpacing: string) => {
    setSettings((prev) => ({ ...prev, listSpacing }));
    localStorage.setItem('listSpacing', listSpacing);
  }, []);

  return {
    settings,
    toggleSettings,
    toggleOpenLinksInNewTab,
    setTheme,
    setFont,
    setSpacing,
  };
}
