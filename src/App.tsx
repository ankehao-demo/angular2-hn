import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSettings } from './context/SettingsContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Settings from './components/Settings/Settings';
import Feed from './pages/Feed/Feed';
import Loader from './components/Loader/Loader';

const ItemDetails = lazy(() => import('./pages/ItemDetails/ItemDetails'));
const UserPage = lazy(() => import('./pages/User/User'));

declare function ga(...args: unknown[]): void;

export default function App() {
  const { theme } = useSettings();
  const location = useLocation();

  useEffect(() => {
    if (typeof ga !== 'undefined') {
      ga('set', 'page', location.pathname);
      ga('send', 'pageview');
    }
  }, [location]);

  return (
    <div className={theme}>
      <div className="bodyCover" />
      <div className="wrapper">
        <Header />
        <Settings />
        <Routes>
          <Route path="/" element={<Navigate to="/news/1" replace />} />
          <Route path="/news/:page" element={<Feed feedType="news" />} />
          <Route path="/newest/:page" element={<Feed feedType="newest" />} />
          <Route path="/show/:page" element={<Feed feedType="show" />} />
          <Route path="/ask/:page" element={<Feed feedType="ask" />} />
          <Route path="/jobs/:page" element={<Feed feedType="jobs" />} />
          <Route
            path="/item/:id"
            element={
              <Suspense fallback={<Loader />}>
                <ItemDetails />
              </Suspense>
            }
          />
          <Route
            path="/user/:id"
            element={
              <Suspense fallback={<Loader />}>
                <UserPage />
              </Suspense>
            }
          />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}
