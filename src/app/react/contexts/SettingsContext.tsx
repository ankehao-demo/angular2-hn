import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Settings } from '../models/Settings';

interface SettingsContextValue {
    settings: Settings;
    toggleSettings: () => void;
    toggleOpenLinksInNewTab: () => void;
    setTheme: (theme: string) => void;
    setFont: (fontSize: string) => void;
    setSpacing: (listSpace: string) => void;
}

const defaultSettings: Settings = {
    showSettings: false,
    openLinkInNewTab: localStorage.getItem('openLinkInNewTab')
        ? JSON.parse(localStorage.getItem('openLinkInNewTab')!)
        : false,
    theme: localStorage.getItem('theme') || 'default',
    titleFontSize: localStorage.getItem('titleFontSize') || '16',
    listSpacing: localStorage.getItem('listSpacing') || '0',
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const setTheme = useCallback((theme: string) => {
        setSettings((prev) => ({ ...prev, theme }));
        localStorage.setItem('theme', theme);
    }, []);

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

    const setFont = useCallback((fontSize: string) => {
        setSettings((prev) => ({ ...prev, titleFontSize: fontSize }));
        localStorage.setItem('titleFontSize', fontSize);
    }, []);

    const setSpacing = useCallback((listSpace: string) => {
        setSettings((prev) => ({ ...prev, listSpacing: listSpace }));
        localStorage.setItem('listSpacing', listSpace);
    }, []);

    // Subscribe to system preferred color scheme changes
    // Mirrors Angular SettingsService constructor + ngOnDestroy
    useEffect(() => {
        const darkColorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

        const handleColorSchemeChange = (event: MediaQueryListEvent): void => {
            const theme = event.matches ? 'night' : 'default';
            setTheme(theme);
        };

        darkColorSchemeMedia.addEventListener('change', handleColorSchemeChange);

        // Init theme: check localStorage first, then fall back to system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setSettings((prev) => ({ ...prev, theme: savedTheme }));
        } else {
            // Apply system preference directly instead of dispatching a synthetic event
            const initialTheme = darkColorSchemeMedia.matches ? 'night' : 'default';
            setTheme(initialTheme);
        }

        return () => {
            darkColorSchemeMedia.removeEventListener('change', handleColorSchemeChange);
        };
    }, [setTheme]);

    return (
        <SettingsContext.Provider
            value={{ settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextValue => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
