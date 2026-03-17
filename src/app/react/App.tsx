import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSettings } from './contexts/SettingsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import './App.scss';

declare let ga: Function;

export const App: React.FC = () => {
    const { settings } = useSettings();
    const location = useLocation();

    // Google Analytics tracking on route change
    // Mirrors Angular constructor: router.events.subscribe(NavigationEnd => ga(...))
    useEffect(() => {
        if (typeof ga === 'function') {
            ga('set', 'page', location.pathname);
            ga('send', 'pageview');
        }
    }, [location.pathname]);

    return (
        <div className={settings.theme}>
            <div className="body-cover"></div>
            <div className="wrapper">
                <Header />
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};
