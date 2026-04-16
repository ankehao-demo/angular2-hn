import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import './Settings.scss';

const Settings: React.FC = () => {
  const { settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing } = useSettings();

  const closeSettings = () => {
    toggleSettings();
  };

  const changeTitleFont = (value: string) => {
    setFont(value);
  };

  const changeSpacing = (value: string) => {
    setSpacing(value);
  };

  return (
    <div id="popup1" className="overlay">
      <div className="popup">
        <h1>Settings</h1>
        <hr />
        <span className="close" onClick={closeSettings}>&times;</span>
        <div className="content">
          <div className="control-section">
            <h2>Links</h2>
            <input
              type="checkbox"
              checked={settings.openLinkInNewTab}
              onChange={toggleOpenLinksInNewTab}
            />
            Open links in a new tab
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
                    onChange={() => setTheme('default')}
                  />
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
                    onChange={() => setTheme('night')}
                  />
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
                    onChange={() => setTheme('amoledblack')}
                  />
                  Black (AMOLED)
                </label>
              </div>
            </div>
            <div className="control-section">
              <h2>Change Font</h2>
              <div>
                <label>
                  Font size:
                  <input
                    min="1"
                    value={settings.titleFontSize}
                    name="theme"
                    type="number"
                    onKeyUp={(e) => changeTitleFont((e.target as HTMLInputElement).value)}
                    onChange={(e) => changeTitleFont(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  List spacing:
                  <input
                    min="0"
                    value={settings.listSpacing}
                    name="theme"
                    type="number"
                    onKeyUp={(e) => changeSpacing((e.target as HTMLInputElement).value)}
                    onChange={(e) => changeSpacing(e.target.value)}
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

export default Settings;
