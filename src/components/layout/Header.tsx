import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { Settings } from '../layout/Settings';
import './Header.scss';

export function Header() {
  const settings = useSettings();

  const scrollTop = () => window.scrollTo(0, 0);

  return (
    <header>
      <div id="header">
        <NavLink className={({ isActive }) => `home-link${isActive ? ' active' : ''}`} to="/news/1" onClick={scrollTop}>
          <div className="logo-inner"></div>
          <img className="logo" src="/assets/images/logo.svg" alt="Logo" />
        </NavLink>
        <div className="header-text">
          <div className="left">
            <span className="header-nav">
              <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/newest/1" onClick={scrollTop}>new</NavLink>
              {' | '}
              <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/show/1" onClick={scrollTop}>show</NavLink>
              {' | '}
              <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/ask/1" onClick={scrollTop}>ask</NavLink>
              {' | '}
              <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/jobs/1" onClick={scrollTop}>jobs</NavLink>
            </span>
          </div>
        </div>
        <div className="info">
          <img className="settings" src="/assets/images/cog.svg" alt="Settings" onClick={() => settings.toggleSettings()} />
        </div>
      </div>
      {settings.showSettings && <Settings />}
    </header>
  );
}
