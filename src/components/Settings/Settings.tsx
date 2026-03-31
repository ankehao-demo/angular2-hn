import { useSettings } from '../../context/SettingsContext';
import './Settings.scss';

export function SettingsPanel() {
  const { settings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing } = useSettings();

  if (!settings.showSettings) {
    return null;
  }

  return (
    <div className="settings-panel">
      <div className="settings-content">
        <h3>Settings</h3>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.openLinkInNewTab}
              onChange={toggleOpenLinksInNewTab}
            />
            Open links in new tab
          </label>
        </div>

        <div className="setting-item">
          <label>Theme:</label>
          <select value={settings.theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="default">Default</option>
            <option value="night">Night</option>
            <option value="amoledblack">AMOLED Black</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Font Size: {settings.titleFontSize}px</label>
          <input
            type="range"
            min="12"
            max="24"
            value={settings.titleFontSize}
            onChange={(e) => setFont(e.target.value)}
          />
        </div>

        <div className="setting-item">
          <label>List Spacing: {settings.listSpacing}px</label>
          <input
            type="range"
            min="0"
            max="20"
            value={settings.listSpacing}
            onChange={(e) => setSpacing(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
