import React, { useCallback } from 'react';

import { useSettings } from '../react-core/useSettings';

/**
 * Settings component — React equivalent of SettingsComponent
 * (src/app/core/settings/settings.component.ts)
 *
 * Renders the settings popup overlay with controls for:
 * - Open links in new tab (checkbox)
 * - Theme selection (default / night / amoledblack radio buttons)
 * - Font size (number input)
 * - List spacing (number input)
 */
export const Settings: React.FC = () => {
  const {
    settings,
    toggleSettings,
    toggleOpenLinksInNewTab,
    setTheme,
    setFont,
    setSpacing,
  } = useSettings();

  const handleCloseSettings = useCallback(() => {
    toggleSettings();
  }, [toggleSettings]);

  const handleTitleFontChange = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      setFont((e.target as HTMLInputElement).value);
    },
    [setFont]
  );

  const handleSpacingChange = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      setSpacing((e.target as HTMLInputElement).value);
    },
    [setSpacing]
  );

  return (
    <div id="popup1" className="overlay">
      <div className="popup">
        <h1>Settings</h1>
        <hr />
        <button
          type="button"
          className="close"
          onClick={handleCloseSettings}
          aria-label="Close settings"
        >
          &times;
        </button>
        <div className="content">
          <div className="control-section">
            <h2>Links</h2>
            <input
              type="checkbox"
              checked={settings.openLinkInNewTab}
              onChange={toggleOpenLinksInNewTab}
            />
            {' Open links in a new tab'}
          </div>
          <div className="theme-controls">
            <div className="control-section">
              <h2>Select a theme</h2>
              <div>
                <label>
                  <input
                    name="theme"
                    type="radio"
                    value="default"
                    checked={settings.theme === 'default'}
                    onClick={() => setTheme('default')}
                    readOnly
                  />
                  {' Default'}
                </label>
              </div>
              <div>
                <label>
                  <input
                    name="theme"
                    type="radio"
                    value="night"
                    checked={settings.theme === 'night'}
                    onClick={() => setTheme('night')}
                    readOnly
                  />
                  {' Night'}
                </label>
              </div>
              <div>
                <label>
                  <input
                    name="theme"
                    type="radio"
                    value="amoledblack"
                    checked={settings.theme === 'amoledblack'}
                    onClick={() => setTheme('amoledblack')}
                    readOnly
                  />
                  {' Black (AMOLED)'}
                </label>
              </div>
            </div>
            <div className="control-section">
              <h2>Change Font</h2>
              <div>
                <label>
                  Font size:{' '}
                  <input
                    min={1}
                    defaultValue={settings.titleFontSize}
                    name="titleFontSize"
                    type="number"
                    onKeyUp={handleTitleFontChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  List spacing:{' '}
                  <input
                    min={0}
                    defaultValue={settings.listSpacing}
                    name="listSpacing"
                    type="number"
                    onKeyUp={handleSpacingChange}
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
