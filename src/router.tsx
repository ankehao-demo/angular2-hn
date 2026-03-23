import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './components/Layout/App';
import FeedPage from './pages/FeedPage';
import Loader from './components/shared/Loader';

// eslint-disable-next-line react-refresh/only-export-components
const ItemDetailsPage = lazy(() => import('./pages/ItemDetailsPage'));
// eslint-disable-next-line react-refresh/only-export-components
const UserPage = lazy(() => import('./pages/UserPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/news/1" replace />,
      },
      {
        path: ':feedType/:page',
        element: <FeedPage />,
      },
      {
        path: 'item/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <ItemDetailsPage />
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
