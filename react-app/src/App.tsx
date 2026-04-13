import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Feed from './pages/Feed';
import ItemDetails from './pages/ItemDetails';
import UserProfile from './pages/UserProfile';
import { SettingsProvider } from './context/SettingsContext';
import { useSettings } from './context/useSettings';
import './styles.scss';
import './App.scss';

function AppContent() {
  const { settings } = useSettings();

  return (
    <div className={settings.theme}>
      <div className="body-cover" />
      <BrowserRouter>
        <div className="wrapper">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/news/1" />} />
            <Route path="/news/:page" element={<Feed feedType="news" />} />
            <Route path="/newest/:page" element={<Feed feedType="newest" />} />
            <Route path="/show/:page" element={<Feed feedType="show" />} />
            <Route path="/ask/:page" element={<Feed feedType="ask" />} />
            <Route path="/jobs/:page" element={<Feed feedType="jobs" />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/user/:id" element={<UserProfile />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
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
