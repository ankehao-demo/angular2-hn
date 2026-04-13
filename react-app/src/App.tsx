import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { FeedPage } from './pages/FeedPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { UserPage } from './pages/UserPage';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
