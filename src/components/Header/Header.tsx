import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import './Header.scss';

const Header: React.FC = () => {
  const { settings, toggleSettings, updateSettings } = useSettings();

  const navItems = [
    { path: '/news/1', label: 'top' },
    { path: '/newest/1', label: 'new' },
    { path: '/show/1', label: 'show' },
    { path: '/ask/1', label: 'ask' },
    { path: '/jobs/1', label: 'jobs' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <NavLink to="/news/1" className="logo-link">
          <img src="/src/assets/images/logo.svg" alt="HN Logo" className="logo" />
        </NavLink>
        <nav className="nav-links">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="settings-toggle" onClick={toggleSettings} aria-label="Settings">
          ⚙
        </button>
      </div>
      {settings.showSettings && (
        <div className="settings-panel">
          <div className="setting-item">
            <label>Theme:</label>
            <select
              value={settings.theme}
              onChange={e => updateSettings({ theme: e.target.value })}
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.openLinkInNewTab}
                onChange={e => updateSettings({ openLinkInNewTab: e.target.checked })}
              />
              Open links in new tab
            </label>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
