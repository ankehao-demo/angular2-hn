import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import SettingsPanel from '../Settings/SettingsPanel';
import styles from './Header.module.scss';

export default function Header() {
  const { settings, toggleSettings } = useSettings();

  const scrollTop = () => window.scrollTo(0, 0);

  return (
    <header>
      <div id="header">
        <NavLink
          to="/news/1"
          className={({ isActive }) => `${styles['home-link']}${isActive ? ' active' : ''}`}
          onClick={scrollTop}
        >
          <div className={styles['logo-inner']}></div>
          <img className={styles.logo} src="/assets/images/logo.svg" alt="Logo" />
        </NavLink>
        <div className={styles['header-text']}>
          <div className={styles.left}>
            <span className={styles['header-nav']}>
              <NavLink to="/newest/1" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollTop}>
                new
              </NavLink>
              {' | '}
              <NavLink to="/show/1" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollTop}>
                show
              </NavLink>
              {' | '}
              <NavLink to="/ask/1" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollTop}>
                ask
              </NavLink>
              {' | '}
              <NavLink to="/jobs/1" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollTop}>
                jobs
              </NavLink>
            </span>
          </div>
        </div>
        <div className={styles.info}>
          <img
            className={styles.settings}
            src="/assets/images/cog.svg"
            alt="Settings"
            onClick={toggleSettings}
          />
        </div>
      </div>
      {settings.showSettings && <SettingsPanel />}
    </header>
  );
}
