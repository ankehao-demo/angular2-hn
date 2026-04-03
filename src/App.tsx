import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { usePageTracking } from './hooks/usePageTracking';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Feed } from './components/feeds/Feed';
import { Loader } from './components/shared/Loader';

const ItemDetails = lazy(() =>
  import('./components/item-details/ItemDetails').then((m) => ({ default: m.ItemDetails }))
);
const UserProfile = lazy(() =>
  import('./components/user/UserProfile').then((m) => ({ default: m.UserProfile }))
);

function PageTracker() {
  usePageTracking();
  return null;
}

function AppContent() {
  const settings = useSettings();

  return (
    <BrowserRouter>
      <PageTracker />
      <div className={settings.theme}>
        <div className="body-cover" />
        <div className="wrapper">
          <Header />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/news/1" replace />} />
              <Route path="/news/:page" element={<Feed feedType="news" />} />
              <Route path="/newest/:page" element={<Feed feedType="newest" />} />
              <Route path="/show/:page" element={<Feed feedType="show" />} />
              <Route path="/ask/:page" element={<Feed feedType="ask" />} />
              <Route path="/jobs/:page" element={<Feed feedType="jobs" />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/user/:id" element={<UserProfile />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
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
