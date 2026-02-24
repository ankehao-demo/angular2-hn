import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { router } from './AppRoutes';

/**
 * React entry point — mirrors Angular's src/main.ts
 *
 * Angular bootstraps via:
 *   platformBrowserDynamic().bootstrapModule(AppModule)
 *
 * React equivalent:
 *   createRoot(container).render(<App />)
 */

const container = document.getElementById('react-root');

if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <SettingsProvider>
                <RouterProvider router={router} />
            </SettingsProvider>
        </React.StrictMode>
    );
}
