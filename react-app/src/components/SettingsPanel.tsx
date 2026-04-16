import { useSettings } from '../context/SettingsContext';

function SettingsPanel() {
  const { settings, updateSettings, showSettings, toggleSettings } = useSettings();

  if (!showSettings) return null;

  return (
    <div className="settings-panel">
      <div className="settings-overlay" onClick={toggleSettings} />
      <div className="settings-content">
        <h3>Settings</h3>
        <div className="setting-item">
          <label>Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value })}
          >
            <option value="default">Default</option>
            <option value="night">Night</option>
            <option value="green">Green</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Font Size: {settings.fontSize}px</label>
          <input
            type="range"
            min="12"
            max="24"
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
          />
        </div>
        <div className="setting-item">
          <label>List Spacing: {settings.listSpacing}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.listSpacing}
            onChange={(e) => updateSettings({ listSpacing: Number(e.target.value) })}
          />
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.openLinkInNewTab}
              onChange={() => updateSettings({ openLinkInNewTab: !settings.openLinkInNewTab })}
            />
            Open links in new tab
          </label>
        </div>
        <button className="close-settings" onClick={toggleSettings}>Close</button>
      </div>
    </div>
  );
}

export default SettingsPanel;
