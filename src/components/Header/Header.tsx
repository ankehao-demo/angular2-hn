import { NavLink, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import styles from './Header.module.scss';

const navItems = [
  { path: '/news/1', prefix: '/news/', label: 'top' },
  { path: '/newest/1', prefix: '/newest/', label: 'new' },
  { path: '/show/1', prefix: '/show/', label: 'show' },
  { path: '/ask/1', prefix: '/ask/', label: 'ask' },
  { path: '/jobs/1', prefix: '/jobs/', label: 'jobs' },
];

export default function Header() {
  const { toggleSettings } = useSettings();
  const location = useLocation();

  return (
    <header className={styles.header}>
      <NavLink to="/news/1" className={styles.logoLink}>
        <img className={styles.logo} src="/assets/images/logo.svg" alt="Logo" />
        <span className={styles.headerTitle}>React HN</span>
      </NavLink>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={
              `${styles.navLink} ${location.pathname.startsWith(item.prefix) ? styles.activeLink : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button className={styles.settingsToggle} onClick={toggleSettings} aria-label="Toggle settings">
        &#9881;
      </button>
    </header>
  );
}
