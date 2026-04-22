import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FeedPage from './pages/FeedPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import UserPage from './pages/UserPage';
import { useSettings } from './context/SettingsContext';
import './App.scss';

export default function App() {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    if (typeof window.ga === 'function') {
      window.ga('set', 'page', location.pathname + location.search);
      window.ga('send', 'pageview');
    }
  }, [location]);

  return (
    <div className={settings.theme}>
      <div className="body-cover" />
      <div className="wrapper">
        <Header />
        <main id="content">
          <Routes>
            <Route path="/" element={<Navigate to="/news/1" replace />} />
            <Route path="/news" element={<Navigate to="/news/1" replace />} />
            <Route path="/news/:page" element={<FeedPage feedType="news" />} />
            <Route path="/newest" element={<Navigate to="/newest/1" replace />} />
            <Route path="/newest/:page" element={<FeedPage feedType="newest" />} />
            <Route path="/show" element={<Navigate to="/show/1" replace />} />
            <Route path="/show/:page" element={<FeedPage feedType="show" />} />
            <Route path="/ask" element={<Navigate to="/ask/1" replace />} />
            <Route path="/ask/:page" element={<FeedPage feedType="ask" />} />
            <Route path="/jobs" element={<Navigate to="/jobs/1" replace />} />
            <Route path="/jobs/:page" element={<FeedPage feedType="jobs" />} />
            <Route path="/item/:id" element={<ItemDetailsPage />} />
            <Route path="/user/:id" element={<UserPage />} />
            <Route path="*" element={<Navigate to="/news/1" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}
