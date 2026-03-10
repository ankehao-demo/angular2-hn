import React from 'react';
import './Loader.scss';

/**
 * Loader component — replaces Angular's LoaderComponent.
 *
 * Displays a CSS loading animation. No inputs/outputs.
 */
export const Loader: React.FC = () => {
  return (
    <div className="loading-section">
      <div className="loader">Loading...</div>
    </div>
  );
};
