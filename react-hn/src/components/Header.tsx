import { NavLink } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import '../styles/Header.scss';

export default function Header() {
  const { toggleSettings } = useSettings();

  return (
    <div id="header">
      <NavLink to="/news/1" className="home-link">
        <img className="logo" src="/assets/images/angular-logo.png" alt="logo" />
        <div className="logo-inner"></div>
      </NavLink>
      <div className="left">
        <div className="header-text">
          <h1>
            <NavLink to="/news/1" className="name">React HN</NavLink>
          </h1>
          <nav className="header-nav">
            <NavLink to="/news/1" className={({ isActive }) => isActive ? 'active' : ''}>news</NavLink>
            <span> | </span>
            <NavLink to="/newest/1" className={({ isActive }) => isActive ? 'active' : ''}>newest</NavLink>
            <span> | </span>
            <NavLink to="/show/1" className={({ isActive }) => isActive ? 'active' : ''}>show</NavLink>
            <span> | </span>
            <NavLink to="/ask/1" className={({ isActive }) => isActive ? 'active' : ''}>ask</NavLink>
            <span> | </span>
            <NavLink to="/jobs/1" className={({ isActive }) => isActive ? 'active' : ''}>jobs</NavLink>
          </nav>
        </div>
      </div>
      <div className="info" onClick={toggleSettings}>
        <img src="/assets/images/settings.png" alt="settings" />
      </div>
    </div>
  );
}
