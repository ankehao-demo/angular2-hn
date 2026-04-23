import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import Header from './Header';
import Footer from './Footer';
import './App.scss';

declare global {
  interface Window {
    ga?: (command: string, ...args: string[]) => void;
  }
}

function AppInner() {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    if (window.ga) {
      window.ga('set', 'page', location.pathname);
      window.ga('send', 'pageview');
    }
  }, [location]);

  return (
    <div className={settings.theme}>
      <div className="body-cover"></div>
      <div className="wrapper">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppInner />
    </SettingsProvider>
  );
}
