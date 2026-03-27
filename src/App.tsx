import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSettings } from './context/SettingsContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import styles from './App.module.scss';

declare function ga(...args: unknown[]): void;

export default function App() {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    if (typeof ga !== 'undefined') {
      ga('set', 'page', location.pathname);
      ga('send', 'pageview');
    }
  }, [location]);

  return (
    <div className={settings.theme}>
      <div className={styles['body-cover']} />
      <div className={styles.wrapper}>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
