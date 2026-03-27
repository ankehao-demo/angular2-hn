import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';
import FeedPage from './pages/Feed/FeedPage';
import Loader from './components/Loader/Loader';

const ItemDetailPage = lazy(() => import('./pages/ItemDetail/ItemDetailPage'));
const UserPage = lazy(() => import('./pages/User/UserPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/news/1" replace /> },
      { path: 'news/:page', element: <FeedPage feedType="news" /> },
      { path: 'newest/:page', element: <FeedPage feedType="newest" /> },
      { path: 'show/:page', element: <FeedPage feedType="show" /> },
      { path: 'ask/:page', element: <FeedPage feedType="ask" /> },
      { path: 'jobs/:page', element: <FeedPage feedType="jobs" /> },
      {
        path: 'item/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <ItemDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'user/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <UserPage />
          </Suspense>
        ),
      },
    ],
  },
]);
