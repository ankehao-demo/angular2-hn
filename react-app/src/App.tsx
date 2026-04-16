import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { getThemeClass } from './services/settings';
import Header from './components/Header';
import Footer from './components/Footer';
import Feed from './components/Feed';
import ItemDetails from './components/ItemDetails';
import UserProfile from './components/UserProfile';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

function AppContent() {
  const { settings } = useSettings();
  const themeClass = getThemeClass(settings.theme);

  return (
    <div className={`app ${themeClass}`} style={{ fontSize: `${settings.fontSize}px` }}>
      <Header />
      <SettingsPanel />
      <div className="wrapper">
        <main className="main-content">
          <Routes>
            <Route path="/:feedType/:page" element={<Feed />} />
            <Route path="/:feedType" element={<Feed />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/" element={<Navigate to="/news/1" replace />} />
            <Route path="*" element={<Navigate to="/news/1" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </BrowserRouter>
  );
}

export default App;
