import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FeedPage } from './pages/FeedPage';
import { Loader } from './components/shared/Loader';

const ItemDetailsPage = lazy(() =>
  import('./pages/ItemDetailsPage').then((m) => ({ default: m.ItemDetailsPage }))
);
const UserPage = lazy(() =>
  import('./pages/UserPage').then((m) => ({ default: m.UserPage }))
);

export function AppRouter() {
  return (
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
  );
}
