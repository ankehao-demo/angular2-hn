import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';
import Feed from './pages/Feed';
import Loader from './components/Loader';

const ItemDetails = lazy(() => import('./pages/ItemDetails'));
const UserPage = lazy(() => import('./pages/User'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/news/1" replace /> },
      { path: ':feedType/:page', element: <Feed /> },
      {
        path: 'item/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <ItemDetails />
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

export default router;
