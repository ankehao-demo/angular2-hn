import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const navItems = [
  { path: '/newest', label: 'new' },
  { path: '/show', label: 'show' },
  { path: '/ask', label: 'ask' },
  { path: '/jobs', label: 'jobs' },
];

function Header() {
  const location = useLocation();
  const { toggleSettings } = useSettings();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/news/1" className="header-logo">
          <div className="logo-inner" />
          <img className="logo-img" src="/assets/images/logo.svg" alt="Logo" />
        </Link>
        <div className="header-text" style={{ position: 'absolute', left: '60px', fontSize: '16px' }}>
          <nav className="header-nav">
            {navItems.map((item, index) => (
              <span key={item.path}>
                <Link
                  to={`${item.path}/1`}
                  className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
                {index < navItems.length - 1 && <span className="nav-separator"> | </span>}
              </span>
            ))}
          </nav>
        </div>
        <button className="settings-btn" onClick={toggleSettings}>
          <img src="/assets/images/cog.svg" alt="Settings" />
        </button>
      </div>
    </header>
  );
}

export default Header;
