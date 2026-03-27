import { lazy, Suspense, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { Header } from './components/core/Header';
import { Footer } from './components/core/Footer';
import { Feed } from './components/feeds/Feed';
import { Loader } from './components/shared/Loader';
import './styles/styles.scss';
import styles from './App.module.scss';

const ItemDetails = lazy(
  () =>
    import('./components/item-details/ItemDetails').then((m) => ({
      default: m.ItemDetails,
    }))
);
const UserProfile = lazy(
  () =>
    import('./components/user/UserProfile').then((m) => ({
      default: m.UserProfile,
    }))
);

declare let ga: (command: string, ...args: string[]) => void;

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof ga !== 'undefined') {
      ga('set', 'page', location.pathname + location.search);
      ga('send', 'pageview');
    }
  }, [location]);

  return null;
}

function AppShell() {
  const { settings } = useSettings();

  return (
    <div className={settings.theme}>
      <div className={styles['body-cover']}></div>
      <div className={styles.wrapper}>
        <Header />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/news/1" replace />} />
            <Route path="/news/:page" element={<Feed feedType="news" />} />
            <Route
              path="/newest/:page"
              element={<Feed feedType="newest" />}
            />
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

export function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AnalyticsTracker />
        <AppShell />
      </SettingsProvider>
    </BrowserRouter>
  );
}
