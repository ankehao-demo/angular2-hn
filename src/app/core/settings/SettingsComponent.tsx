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
 *
 * TODO: The parent component should conditionally render this based on settings.showSettings
 * TODO: Theme changes trigger global CSS class changes at the app level (not handled here)
 * TODO: Styles rely on Angular SCSS build pipeline — may need CSS module or import adjustments
 *       when React build tooling is integrated
 *
 * Usage with useSettingsService hook:
 *   const { settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing } = useSettingsService();
 *   <SettingsComponent
 *     settings={settings}
 *     onToggleSettings={toggleSettings}
 *     onToggleOpenLinksInNewTab={toggleOpenLinksInNewTab}
 *     onSelectTheme={setTheme}
 *     onChangeTitleFont={setFont}
 *     onChangeSpacing={setSpacing}
 *   />
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

  return (
    <div id="popup1" className="overlay">
      <div className="popup">
        <h1>Settings</h1>
        <hr />
        <span className="close" onClick={closeSettings}>
          &times;
        </span>
        <div className="content">
          {/* Links section */}
          <div className="control-section">
            <h2>Links</h2>
            <input
              type="checkbox"
              checked={settings.openLinkInNewTab}
              onChange={handleToggleOpenLinksInNewTab}
            />{' '}
            Open links in a new tab
          </div>

          <div className="theme-controls">
            {/* Theme selection */}
            <div className="control-section">
              <h2>Select a theme</h2>
              <div>
                <label>
                  <input
                    name="theme"
                    type="radio"
                    value="default"
                    checked={settings.theme === 'default'}
                    onChange={() => handleSelectTheme('default')}
                  />{' '}
                  Default
                </label>
              </div>
              <div>
                <label>
                  <input
                    name="theme"
                    type="radio"
                    value="night"
                    checked={settings.theme === 'night'}
                    onChange={() => handleSelectTheme('night')}
                  />{' '}
                  Night
                </label>
              </div>
              <div>
                <label>
                  <input
                    name="theme"
                    type="radio"
                    value="amoledblack"
                    checked={settings.theme === 'amoledblack'}
                    onChange={() => handleSelectTheme('amoledblack')}
                  />{' '}
                  Black (AMOLED)
                </label>
              </div>
            </div>

            {/* Font and spacing controls */}
            <div className="control-section">
              <h2>Change Font</h2>
              <div>
                <label>
                  Font size:
                  <input
                    min={1}
                    defaultValue={settings.titleFontSize}
                    name="titleFont"
                    type="number"
                    onKeyUp={handleChangeTitleFont}
                  />
                </label>
              </div>
              <div>
                <label>
                  List spacing:
                  <input
                    min={0}
                    defaultValue={settings.listSpacing}
                    name="listSpacing"
                    type="number"
                    onKeyUp={handleChangeSpacing}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
