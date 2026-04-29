import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import App from './App';
import { Feed } from './components/Feed/Feed';
import { ItemDetails } from './components/ItemDetails/ItemDetails';
import { UserProfile } from './components/User/User';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/news/1" replace />} />
            <Route path="news/:page" element={<Feed />} />
            <Route path="newest/:page" element={<Feed />} />
            <Route path="show/:page" element={<Feed />} />
            <Route path="ask/:page" element={<Feed />} />
            <Route path="jobs/:page" element={<Feed />} />
            <Route path="item/:id" element={<ItemDetails />} />
            <Route path="user/:id" element={<UserProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  </StrictMode>
);
