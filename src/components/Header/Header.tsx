import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Settings from '../Settings/Settings';
import './Header.scss';

function scrollTop() {
  window.scrollTo(0, 0);
}

export default function Header() {
  const { settings, toggleSettings } = useSettings();

  return (
    <header>
      <div id="header">
        <NavLink className="home-link" to="/news/1" onClick={scrollTop}>
          <div className="logo-inner"></div>
          <img className="logo" src="/src/assets/images/logo.svg" alt="Logo" />
        </NavLink>
        <div className="header-text">
          <div className="left">
            <span className="header-nav">
              <NavLink to="/newest/1" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollTop}>new</NavLink>
                |
              <NavLink to="/show/1" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollTop}>show</NavLink>
                |
              <NavLink to="/ask/1" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollTop}>ask</NavLink>
                |
              <NavLink to="/jobs/1" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollTop}>jobs</NavLink>
            </span>
          </div>
        </div>
        <div className="info">
          <button type="button" className="settings-btn" onClick={toggleSettings} aria-label="Toggle settings">
            <img className="settings" src="/src/assets/images/cog.svg" alt="Settings" />
          </button>
        </div>
      </div>
      {settings.showSettings && <Settings />}
    </header>
  );
}
