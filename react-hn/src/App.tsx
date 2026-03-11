import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { usePageTracking } from './hooks/usePageTracking';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Feed from './pages/Feed/Feed';
import Loader from './components/Loader/Loader';
import './App.scss';

const ItemDetails = lazy(() => import('./pages/ItemDetails/ItemDetails'));
const UserProfile = lazy(() => import('./pages/UserProfile/UserProfile'));

function AppContent() {
  const { settings } = useSettings();
  usePageTracking();
  return (
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
