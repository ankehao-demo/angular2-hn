import { NavLink, Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import SettingsPanel from './SettingsPanel';
import './Header.scss';

const scrollTop = () => window.scrollTo(0, 0);

export default function Header() {
  const { settings, toggleSettings } = useSettings();

  return (
    <header>
      <div id="header">
        <Link to="/news/1" className="home-link" onClick={scrollTop}>
          <div className="logo-inner" />
          <img className="logo" src="/assets/images/logo.svg" alt="Logo" />
        </Link>
        <div className="header-text">
          <div className="left">
            <span className="header-nav">
              <NavLink
                to="/newest/1"
                onClick={scrollTop}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                new
              </NavLink>
              {' | '}
              <NavLink
                to="/show/1"
                onClick={scrollTop}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                show
              </NavLink>
              {' | '}
              <NavLink
                to="/ask/1"
                onClick={scrollTop}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                ask
              </NavLink>
              {' | '}
              <NavLink
                to="/jobs/1"
                onClick={scrollTop}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                jobs
              </NavLink>
            </span>
          </div>
        </div>
        <div className="info">
          <button
            type="button"
            className="settings"
            aria-label="Toggle settings"
            aria-expanded={settings.showSettings}
            onClick={toggleSettings}
          >
            <img src="/assets/images/cog.svg" alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
      {settings.showSettings && <SettingsPanel />}
    </header>
  );
}
