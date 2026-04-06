import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import styles from './Header.module.scss';

const navItems = [
  { path: '/news/1', label: 'top' },
  { path: '/newest/1', label: 'new' },
  { path: '/show/1', label: 'show' },
  { path: '/ask/1', label: 'ask' },
  { path: '/jobs/1', label: 'jobs' },
];

export default function Header() {
  const { toggleSettings } = useSettings();

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
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ''}`
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
