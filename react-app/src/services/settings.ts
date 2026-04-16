import { Settings, DEFAULT_SETTINGS } from '../models/settings';

export function loadSettings(): Settings {
  try {
    const theme = localStorage.getItem('theme');
    const titleFontSize = localStorage.getItem('titleFontSize');
    const listSpacing = localStorage.getItem('listSpacing');
    const openLinkInNewTab = localStorage.getItem('openLinkInNewTab');

    const settings: Settings = { ...DEFAULT_SETTINGS };
    if (theme) settings.theme = theme;
    if (titleFontSize) settings.fontSize = parseInt(titleFontSize, 10) || DEFAULT_SETTINGS.fontSize;
    if (listSpacing) settings.listSpacing = parseInt(listSpacing, 10) || DEFAULT_SETTINGS.listSpacing;
    if (openLinkInNewTab) settings.openLinkInNewTab = JSON.parse(openLinkInNewTab);

    if (!theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      settings.theme = prefersDark ? 'night' : 'default';
    }

    return settings;
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('titleFontSize', String(settings.fontSize));
    localStorage.setItem('listSpacing', String(settings.listSpacing));
    localStorage.setItem('openLinkInNewTab', JSON.stringify(settings.openLinkInNewTab));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function getThemeClass(theme: string): string {
  switch (theme) {
    case 'night': return 'theme-dark';
    case 'green': return 'theme-green';
    default: return 'theme-default';
  }
}
