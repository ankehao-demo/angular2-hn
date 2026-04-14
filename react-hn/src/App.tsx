import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSettings } from './hooks/useSettings';
import Header from './components/Header';
import Footer from './components/Footer';
import Settings from './components/Settings';
import './styles/App.scss';

declare global {
  interface Window {
    ga?: (command: string, ...args: string[]) => void;
  }
}

export default function App() {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    if (window.ga) {
      window.ga('set', 'page', location.pathname);
      window.ga('send', 'pageview');
    }
  }, [location.pathname]);

  return (
    <div className={settings.theme}>
      <div className="body-cover" />
      <div className="wrapper">
        <Header />
        <Outlet />
        <Footer />
      </div>
      <Settings />
    </div>
  );
}
