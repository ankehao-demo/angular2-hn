import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSettings } from './context/SettingsContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Loader from './components/Loader';
import FeedPage from './pages/FeedPage';
import './styles/app.scss';

const ItemDetailsPage = lazy(() => import('./pages/ItemDetailsPage'));
const UserPage = lazy(() => import('./pages/UserPage'));

declare function ga(...args: string[]): void;

function App() {
    const { settings } = useSettings();
    const location = useLocation();

    useEffect(() => {
        if (typeof ga !== 'undefined') {
            ga('set', 'page', location.pathname);
            ga('send', 'pageview');
        }
    }, [location]);

    return (
        <div className={settings.theme}>
            <div className="body-cover" />
            <div className="wrapper">
                <Header />
                <Suspense fallback={<Loader />}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/news/1" replace />} />
                        <Route path="/news/:page" element={<FeedPage feedType="news" />} />
                        <Route path="/newest/:page" element={<FeedPage feedType="newest" />} />
                        <Route path="/show/:page" element={<FeedPage feedType="show" />} />
                        <Route path="/ask/:page" element={<FeedPage feedType="ask" />} />
                        <Route path="/jobs/:page" element={<FeedPage feedType="jobs" />} />
                        <Route path="/item/:id" element={<ItemDetailsPage />} />
                        <Route path="/user/:id" element={<UserPage />} />
                    </Routes>
                </Suspense>
                <Footer />
            </div>
        </div>
    );
}

export default App;
