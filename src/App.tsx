import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { usePageTracking } from './hooks/usePageTracking';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import Feed from './pages/Feed';
import styles from './App.module.scss';

const ItemDetails = React.lazy(() => import('./pages/ItemDetails'));
const User = React.lazy(() => import('./pages/User'));

function AppContent() {
  const { settings } = useSettings();
  usePageTracking();

  return (
    <div className={settings.theme}>
      <div className={styles['body-cover']}></div>
      <div className={`${styles.wrapper} wrapper`}>
        <Header />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/news/1" replace />} />
            <Route path="/news/:page" element={<Feed />} />
            <Route path="/newest/:page" element={<Feed />} />
            <Route path="/show/:page" element={<Feed />} />
            <Route path="/ask/:page" element={<Feed />} />
            <Route path="/jobs/:page" element={<Feed />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/user/:id" element={<User />} />
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
