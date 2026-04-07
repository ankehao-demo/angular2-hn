import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AppRouter } from './Router';
import './styles/app.scss';

declare global {
  interface Window {
    ga?: (...args: unknown[]) => void;
  }
}

function AppContent() {
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
        <AppRouter />
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
