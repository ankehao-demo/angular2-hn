import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider, useSettings } from './shared/services/SettingsContext';
import Header from './core/header/Header';
import Footer from './core/footer/Footer';
import AppRoutes from './routes';
import './app.component.scss';

function AppContent() {
  const { settings } = useSettings();

  return (
    <div className={settings.theme}>
      <div className="body-cover"></div>
      <div className="wrapper">
        <Header />
        <AppRoutes />
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </BrowserRouter>
  );
}
