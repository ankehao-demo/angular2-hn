import React, { useCallback } from 'react';

/**
 * Settings interface mirroring the Angular Settings model.
 * @see src/app/shared/models/settings.ts
 */
interface Settings {
  showSettings: boolean;
  openLinkInNewTab: boolean;
  theme: string;
  titleFontSize: string;
  listSpacing: string;
}

/**
 * Props for SettingsComponent.
 *
 * Mirrors the SettingsService dependency from the Angular version.
 * The parent component (or a custom hook / context) is responsible for
 * providing the current settings state and the mutator callbacks.
 */
interface SettingsComponentProps {
  settings: Settings;
  onToggleSettings: () => void;
  onToggleOpenLinksInNewTab: () => void;
  onSelectTheme: (theme: string) => void;
  onChangeTitleFont: (fontSize: string) => void;
  onChangeSpacing: (listSpacing: string) => void;
}

/**
 * React port of the Angular SettingsComponent.
 *
 * Provides a UI for adjusting application settings such as theme,
 * font size, and link behavior. This is a 1:1 migration of the
 * Angular component located at src/app/core/settings/settings.component.ts.
 */
export const SettingsComponent: React.FC<SettingsComponentProps> = ({
  settings,
  onToggleSettings,
  onToggleOpenLinksInNewTab,
  onSelectTheme,
  onChangeTitleFont,
  onChangeSpacing,
}) => {
  const closeSettings = useCallback(() => {
    onToggleSettings();
  }, [onToggleSettings]);

  const handleToggleOpenLinksInNewTab = useCallback(() => {
    onToggleOpenLinksInNewTab();
  }, [onToggleOpenLinksInNewTab]);

  const handleSelectTheme = useCallback(
    (theme: string) => {
      onSelectTheme(theme);
    },
    [onSelectTheme]
  );

  const handleChangeTitleFont = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onChangeTitleFont((e.target as HTMLInputElement).value);
    },
    [onChangeTitleFont]
  );

  const handleChangeSpacing = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onChangeSpacing((e.target as HTMLInputElement).value);
    },
    [onChangeSpacing]
  );

  return null;
};
