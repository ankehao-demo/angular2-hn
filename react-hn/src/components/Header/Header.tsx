import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import Settings from '../Settings/Settings';
import styles from './Header.module.scss';

export default function Header() {
  const { settings, toggleSettings } = useSettings();
  const location = useLocation();

  const scrollTop = () => window.scrollTo(0, 0);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header>
      <div id="header" className={styles.header}>
        <Link
          className={styles['home-link']}
          to="/news/1"
          onClick={scrollTop}
        >
          <div className="logo-inner"></div>
          <img className={styles.logo} src="/assets/images/logo.svg" alt="Logo" />
        </Link>
        <div className={styles['header-text']}>
          <div className={styles.left}>
            <span className={styles['header-nav']}>
              <Link
                to="/newest/1"
                className={isActive('/newest') ? styles.active : ''}
                onClick={scrollTop}
              >
                new
              </Link>
              {' | '}
              <Link
                to="/show/1"
                className={isActive('/show') ? styles.active : ''}
                onClick={scrollTop}
              >
                show
              </Link>
              {' | '}
              <Link
                to="/ask/1"
                className={isActive('/ask') ? styles.active : ''}
                onClick={scrollTop}
              >
                ask
              </Link>
              {' | '}
              <Link
                to="/jobs/1"
                className={isActive('/jobs') ? styles.active : ''}
                onClick={scrollTop}
              >
                jobs
              </Link>
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
      {settings.showSettings && <Settings />}
    </header>
  );
}
