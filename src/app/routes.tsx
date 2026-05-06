import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Feed from './feeds/feed/Feed';
import Loader from './shared/components/loader/Loader';

const ItemDetails = lazy(() => import('./item-details/ItemDetails'));
const User = lazy(() => import('./user/User'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/news/1" replace />} />
      <Route path="/news/:page" element={<Feed feedType="news" />} />
      <Route path="/newest/:page" element={<Feed feedType="newest" />} />
      <Route path="/show/:page" element={<Feed feedType="show" />} />
      <Route path="/ask/:page" element={<Feed feedType="ask" />} />
      <Route path="/jobs/:page" element={<Feed feedType="jobs" />} />
      <Route
        path="/item/:id"
        element={
          <Suspense fallback={<Loader />}>
            <ItemDetails />
          </Suspense>
        }
      />
      <Route
        path="/user/:id"
        element={
          <Suspense fallback={<Loader />}>
            <User />
          </Suspense>
        }
      />
    </Routes>
  );
}
