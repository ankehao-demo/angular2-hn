import { useSettings } from '../context/SettingsContext';
import type { ThemeName } from '../types/settings';
import './SettingsPanel.scss';

const THEMES: Array<{ value: ThemeName; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'night', label: 'Night' },
  { value: 'amoledblack', label: 'Black (AMOLED)' },
];

export default function SettingsPanel() {
  const {
    settings,
    toggleSettings,
    toggleOpenLinksInNewTab,
    setTheme,
    setFont,
    setSpacing,
  } = useSettings();

  return (
    <div id="popup1" className="overlay">
      <div className="popup">
        <h1>Settings</h1>
        <hr />
        <span className="close" onClick={toggleSettings} aria-label="Close settings">
          ×
        </span>
        <div className="content">
          <div className="control-section">
            <h2>Links</h2>
            <label>
              <input
                type="checkbox"
                checked={settings.openLinkInNewTab}
                onChange={toggleOpenLinksInNewTab}
              />{' '}
              Open links in a new tab
            </label>
          </div>
          <div className="theme-controls">
            <div className="control-section">
              <h2>Select a theme</h2>
              {THEMES.map((t) => (
                <div key={t.value}>
                  <label>
                    <input
                      name="theme"
                      type="radio"
                      value={t.value}
                      checked={settings.theme === t.value}
                      onChange={() => setTheme(t.value)}
                    />{' '}
                    {t.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="control-section">
              <h2>Change Font</h2>
              <div>
                <label>
                  Font size:{' '}
                  <input
                    min="1"
                    value={settings.titleFontSize}
                    name="fontSize"
                    type="number"
                    onChange={(e) => setFont(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  List spacing:{' '}
                  <input
                    min="0"
                    value={settings.listSpacing}
                    name="listSpacing"
                    type="number"
                    onChange={(e) => setSpacing(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
