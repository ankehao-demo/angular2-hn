import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PlaceholderLayout from './components/PlaceholderLayout';
import PlaceholderFeed from './components/PlaceholderFeed';

// Lazy-loaded components (placeholders for now, will be built in later phases)
const LazyItemDetails = React.lazy(() => import('./components/PlaceholderItemDetails'));
const LazyUser = React.lazy(() => import('./components/PlaceholderUser'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PlaceholderLayout />,
    children: [
      { index: true, element: <Navigate to="/news/1" replace /> },
      { path: 'news/:page', element: <PlaceholderFeed /> },
      { path: 'newest/:page', element: <PlaceholderFeed /> },
      { path: 'show/:page', element: <PlaceholderFeed /> },
      { path: 'ask/:page', element: <PlaceholderFeed /> },
      { path: 'jobs/:page', element: <PlaceholderFeed /> },
      {
        path: 'item/:id',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyItemDetails />
          </React.Suspense>
        ),
      },
      {
        path: 'user/:id',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyUser />
          </React.Suspense>
        ),
      },
    ],
  },
]);
