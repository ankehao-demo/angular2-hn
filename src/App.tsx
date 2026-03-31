import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Feed from './components/Feed/Feed';
import ItemDetails from './components/ItemDetails/ItemDetails';
import UserProfile from './components/UserProfile/UserProfile';
import './App.scss';

function AppLayout() {
  const { settings } = useSettings();

  return (
    <div className={settings.theme}>
      <div className="body-cover"></div>
      <div className="wrapper">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/news/1" replace />} />
          <Route path="/news/:page" element={<Feed />} />
          <Route path="/newest/:page" element={<Feed />} />
          <Route path="/show/:page" element={<Feed />} />
          <Route path="/ask/:page" element={<Feed />} />
          <Route path="/jobs/:page" element={<Feed />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppLayout />
      </SettingsProvider>
    </BrowserRouter>
  );
}
