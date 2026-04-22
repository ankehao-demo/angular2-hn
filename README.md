<p align="center">
  <a href="https://angular2-hn.firebaseapp.com">
    <img alt="HN React" title="HN React" src="http://i.imgur.com/J303pQ4.png" width="150">
  </a>
</p>

<p align="center">
  A progressive Hacker News client built with React + TypeScript (migrated from Angular).
</p>

---

:zap: **Fast:** Service Worker App Shell + dynamic content model for fast loads with and without a network.

:iphone: **Responsive:** Completely responsive UI that installs to your mobile home screen for a native feel.

:rocket: **Progressive:** PWA with offline support via [Workbox](https://developer.chrome.com/docs/workbox) through [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/).

## Tech stack

- [React 18](https://react.dev/) with TypeScript
- [Vite](https://vitejs.dev/) for the dev server and builds
- [React Router v6](https://reactrouter.com/) for routing
- [Sass](https://sass-lang.com/) for theming
- [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) + Workbox for PWA/offline support
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) for tests
- [ESLint](https://eslint.org/) + TypeScript ESLint for linting

The Hacker News data is served by [`node-hnapi`](https://github.com/cheeaun/node-hnapi).

## Offline Support

The app registers a service worker on load (`registerSW` in `src/main.tsx`) and precaches the app shell plus static assets via Workbox so it works offline after the first load.

## Manifest

The app ships a Web App Manifest and set of PWA icons under `public/assets/icons/`, so users on Chromium-based mobile browsers can install it to their home screen.

## Themes

Built-in theme engine. Open the gear icon in the header to switch:
- **Default** (light)
- **Night** (dark)
- **Black (AMOLED)**

The default theme honors `prefers-color-scheme: dark` on first load; subsequent choices are persisted to `localStorage`.

## Running locally

```sh
# Install dependencies
npm install

# Start the Vite dev server at http://localhost:5173
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview

# Run the test suite
npm test

# Lint
npm run lint
```

## Deployment

Production builds in `dist/` are deployed to Firebase Hosting. See [`firebase.json`](./firebase.json) for hosting rules (SPA rewrites point all routes to `index.html`).

CI runs on GitHub Actions ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) and lints, tests, and builds the project on every push/PR.

## Contributors

A million thanks to some awesome people :)

* [Ashwin Sureshkumar](https://github.com/ashwin-sureshkumar)
* [Mateusz](https://github.com/mateuszwitkowski)
* [Jordi Collell](https://github.com/jordic)
* [Ben Brooks](https://github.com/bbrks)
* [Zach Berger](https://github.com/zachberger)
* [blAck PR](https://github.com/blackpr)
* [Bram Borggreve](https://github.com/beeman)
* [Antonio Indrianjafy](https://github.com/Antogin)
* [Addy Osmani](https://github.com/addyosmani)
* [Majid Hajian](https://github.com/mhadaily)
* [Jeff Cross](https://github.com/jeffbcross)
* [Minko Gechev](https://github.com/mgechev)
