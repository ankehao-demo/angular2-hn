import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Loader } from './components/Loader/Loader';
import { Feed } from './pages/Feed/Feed';
import './styles/global.scss';
import styles from './App.module.scss';

const ItemDetails = lazy(() =>
    import('./pages/ItemDetails/ItemDetails').then((m) => ({ default: m.ItemDetails }))
);
const UserProfile = lazy(() =>
    import('./pages/UserProfile/UserProfile').then((m) => ({ default: m.UserProfile }))
);

function PageViewTracker() {
    const location = useLocation();

    useEffect(() => {
        if (typeof window.ga === 'function') {
            window.ga('set', 'page', location.pathname + location.search);
            window.ga('send', 'pageview');
        }
    }, [location]);

    return null;
}

function AppShell() {
    const { settings } = useSettings();

    return (
        <div className={settings.theme}>
            <div className={styles.bodyCover} />
            <div className={styles.wrapper}>
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

export function App() {
    return (
        <BrowserRouter>
            <SettingsProvider>
                <PageViewTracker />
                <AppShell />
            </SettingsProvider>
        </BrowserRouter>
    );
}
