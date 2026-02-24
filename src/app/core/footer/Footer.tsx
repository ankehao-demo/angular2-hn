import React from 'react';

/**
 * Footer component — React equivalent of FooterComponent
 * (src/app/core/footer/footer.component.ts)
 *
 * Renders the persistent bottom footer with a GitHub link.
 * This is a purely presentational component with no logic.
 */
export const Footer: React.FC = () => {
  return (
    <div id="footer">
      <p>
        Show this project some &#10084; on{' '}
        <a
          href="https://github.com/hdjirdeh/angular2-hn"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
    </div>
  );
};
