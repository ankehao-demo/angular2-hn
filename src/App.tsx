import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FeedPage } from './pages/Feed';
import { Loader } from './components/Loader';
import './styles/globals.scss';
import './App.scss';

const ItemDetailsPage = lazy(() =>
  import('./pages/ItemDetails').then((m) => ({ default: m.ItemDetailsPage }))
);
const UserPage = lazy(() =>
  import('./pages/User').then((m) => ({ default: m.UserPage }))
);

declare function ga(...args: unknown[]): void;

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof ga !== 'undefined') {
      ga('set', 'page', location.pathname);
      ga('send', 'pageview');
    }
  }, [location]);

  return null;
}

function AppContent() {
  const { settings } = useSettings();

  return (
    <div className={settings.theme}>
      <div className="body-cover"></div>
      <div className="wrapper">
        <Header />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/news/1" replace />} />
            <Route path="/news/:page" element={<FeedPage />} />
            <Route path="/newest/:page" element={<FeedPage />} />
            <Route path="/show/:page" element={<FeedPage />} />
            <Route path="/ask/:page" element={<FeedPage />} />
            <Route path="/jobs/:page" element={<FeedPage />} />
            <Route path="/item/:id" element={<ItemDetailsPage />} />
            <Route path="/user/:id" element={<UserPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTracker />
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </BrowserRouter>
  );
}
