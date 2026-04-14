import { useSettings } from '../hooks/useSettings';
import '../styles/Settings.scss';

export default function Settings() {
  const { settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing } = useSettings();

  if (!settings.showSettings) {
    return null;
  }

  return (
    <div className="overlay" onClick={toggleSettings}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={toggleSettings}>&times;</span>
        <h1>Settings</h1>
        <hr />
        <div className="content">
          <div className="control-section">
            <h2>Theme</h2>
            <label>
              <input
                type="radio"
                name="theme"
                value="default"
                checked={settings.theme === 'default'}
                onChange={() => setTheme('default')}
              />{' '}
              Default
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="theme"
                value="night"
                checked={settings.theme === 'night'}
                onChange={() => setTheme('night')}
              />{' '}
              Night
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="theme"
                value="amoledblack"
                checked={settings.theme === 'amoledblack'}
                onChange={() => setTheme('amoledblack')}
              />{' '}
              AMOLED Black
            </label>
          </div>
          <div className="control-section">
            <h2>Open Links in New Tab</h2>
            <label>
              <input
                type="checkbox"
                checked={settings.openLinkInNewTab}
                onChange={toggleOpenLinksInNewTab}
              />{' '}
              Enabled
            </label>
          </div>
          <div className="control-section">
            <h2>Title Font Size</h2>
            <input
              type="number"
              value={settings.titleFontSize}
              onChange={(e) => setFont(e.target.value)}
              min="10"
              max="30"
            />
          </div>
          <div className="control-section">
            <h2>List Spacing</h2>
            <input
              type="number"
              value={settings.listSpacing}
              onChange={(e) => setSpacing(e.target.value)}
              min="0"
              max="50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
