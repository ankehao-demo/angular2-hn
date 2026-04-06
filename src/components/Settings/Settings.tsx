import { useSettings } from '../../context/SettingsContext';
import styles from './Settings.module.scss';

const themes = [
  { value: 'default', label: 'Default' },
  { value: 'night', label: 'Night' },
  { value: 'amoledblack', label: 'AMOLED Black' },
];

export default function Settings() {
  const { showSettings, openLinkInNewTab, theme, titleFontSize, listSpacing, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing } =
    useSettings();

  return (
    <div className={`${styles.settings} ${showSettings ? styles.open : ''}`}>
      <div className={styles.settingRow}>
        <span className={styles.settingLabel}>Theme:</span>
        <div className={styles.themeButtons}>
          {themes.map((t) => (
            <button
              key={t.value}
              className={`${styles.themeButton} ${theme === t.value ? styles.active : ''}`}
              onClick={() => setTheme(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.settingRow}>
        <span className={styles.settingLabel}>Title Font Size:</span>
        <input
          type="range"
          className={styles.rangeInput}
          min="12"
          max="22"
          value={titleFontSize}
          onChange={(e) => setFont(e.target.value)}
        />
        <span className={styles.rangeValue}>{titleFontSize}px</span>
      </div>
      <div className={styles.settingRow}>
        <span className={styles.settingLabel}>List Spacing:</span>
        <input
          type="range"
          className={styles.rangeInput}
          min="0"
          max="20"
          value={listSpacing}
          onChange={(e) => setSpacing(e.target.value)}
        />
        <span className={styles.rangeValue}>{listSpacing}px</span>
      </div>
      <div className={styles.settingRow}>
        <span className={styles.settingLabel}>Open Links in New Tab:</span>
        <button
          className={`${styles.toggleButton} ${openLinkInNewTab ? styles.active : ''}`}
          onClick={toggleOpenLinksInNewTab}
        >
          {openLinkInNewTab ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
}
