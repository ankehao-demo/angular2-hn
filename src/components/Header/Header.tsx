import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import './Header.scss';

export function Header() {
  const { toggleSettings } = useSettings();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <NavLink to="/news/1" className="header-logo">
            HN
          </NavLink>
          <nav className="header-nav">
            <NavLink to="/news/1" className={({ isActive }) => isActive ? 'active' : ''}>
              news
            </NavLink>
            <NavLink to="/newest/1" className={({ isActive }) => isActive ? 'active' : ''}>
              newest
            </NavLink>
            <NavLink to="/show/1" className={({ isActive }) => isActive ? 'active' : ''}>
              show
            </NavLink>
            <NavLink to="/ask/1" className={({ isActive }) => isActive ? 'active' : ''}>
              ask
            </NavLink>
            <NavLink to="/jobs/1" className={({ isActive }) => isActive ? 'active' : ''}>
              jobs
            </NavLink>
          </nav>
        </div>
        <button className="settings-toggle" onClick={toggleSettings} aria-label="Toggle settings">
          &#9881;
        </button>
      </div>
    </header>
  );
}
