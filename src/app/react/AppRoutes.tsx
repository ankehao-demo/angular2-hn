import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { App } from './App';

// Placeholder components for lazy-loaded routes
// TODO: These will be replaced when the actual components are migrated to React

const FeedPlaceholder: React.FC = () => (
    <div>
        {/* TODO: Replace with migrated FeedComponent */}
        <p>Feed Placeholder - Component migration pending</p>
    </div>
);

const ItemDetailsPlaceholder = lazy(() =>
    Promise.resolve({
        default: (() => {
            const Component: React.FC = () => (
                <div>
                    {/* TODO: Replace with migrated ItemDetailsComponent */}
                    <p>Item Details Placeholder - Component migration pending</p>
                </div>
            );
            Component.displayName = 'ItemDetailsPlaceholder';
            return Component;
        })(),
    })
);

const UserPlaceholder = lazy(() =>
    Promise.resolve({
        default: (() => {
            const Component: React.FC = () => (
                <div>
                    {/* TODO: Replace with migrated UserComponent */}
                    <p>User Placeholder - Component migration pending</p>
                </div>
            );
            Component.displayName = 'UserPlaceholder';
            return Component;
        })(),
    })
);

/**
 * React Router route configuration mirroring Angular app.routes.ts
 *
 * Angular route structure:
 * - '' -> redirect to 'news/1'
 * - 'news/:page'     -> FeedComponent (data: { feedType: 'news' })
 * - 'newest/:page'   -> FeedComponent (data: { feedType: 'newest' })
 * - 'show/:page'     -> FeedComponent (data: { feedType: 'show' })
 * - 'ask/:page'      -> FeedComponent (data: { feedType: 'ask' })
 * - 'jobs/:page'     -> FeedComponent (data: { feedType: 'jobs' })
 * - 'item/:id'       -> ItemDetailsComponent (lazy-loaded)
 * - 'user/:id'       -> UserComponent (lazy-loaded)
 */

const feedTypes = ['news', 'newest', 'show', 'ask', 'jobs'] as const;

const feedRoutes: RouteObject[] = feedTypes.map((feedType) => ({
    path: `${feedType}/:page`,
    element: <FeedPlaceholder />,
    handle: { feedType },
}));

const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            // Default redirect: '' -> 'news/1'
            {
                index: true,
                element: <Navigate to="/news/1" replace />,
            },
            // Feed routes with feedType data
            ...feedRoutes,
            // Lazy-loaded item details route
            {
                path: 'item/:id',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ItemDetailsPlaceholder />
                    </Suspense>
                ),
            },
            // Lazy-loaded user route
            {
                path: 'user/:id',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserPlaceholder />
                    </Suspense>
                ),
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
