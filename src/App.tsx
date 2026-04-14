import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import FeedPage from './pages/FeedPage';
import './styles/app.scss';

const ItemDetailsPage = lazy(() => import('./pages/ItemDetailsPage'));
const UserPage = lazy(() => import('./pages/UserPage'));

declare function ga(...args: unknown[]): void;

function GATracker() {
  const location = useLocation();
  useEffect(() => {
    if (typeof ga === 'function') {
      ga('set', 'page', location.pathname + location.search);
      ga('send', 'pageview');
    }
  }, [location]);
  return null;
}

function AppContent() {
  const { settings } = useSettings();

  return (
    <BrowserRouter>
      <GATracker />
      <div className={settings.theme}>
        <div className="body-cover"></div>
        <div className="wrapper">
          <Header />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/news/1" replace />} />
              <Route path="/:feedType/:page" element={<FeedPage />} />
              <Route path="/item/:id" element={<ItemDetailsPage />} />
              <Route path="/user/:id" element={<UserPage />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
