import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Feed from './pages/Feed';
import ItemDetails from './pages/ItemDetails';
import UserProfile from './pages/UserProfile';
import { SettingsProvider } from './context/SettingsContext';
import './styles.scss';
import './App.scss';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Header />
        <div className="wrapper">
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
        </div>
        <Footer />
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
