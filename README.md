# React HN

A progressive Hacker News client built with **React**, **TypeScript**, and **Vite**.

Migrated from the original [Angular 2 HN](https://github.com/housseindjirdeh/angular2-hn) project.

---

**Fast:** Service Worker App Shell + Dynamic Content model to achieve faster load times with and without a network.

**Responsive:** Completely responsive UI that can be installed to your mobile home screen to provide a native feel.

**Progressive:** Built as a Progressive Web App with offline support.

## Features

- Hacker News feeds: Top, Newest, Show, Ask, Jobs
- Item details with recursive comment trees
- User profiles
- Built-in theme engine (Default, Night, AMOLED Black)
- Customizable settings (font size, list spacing, link behavior)
- PWA with offline support via Workbox
- Lazy-loaded routes for fast initial load

## Tech Stack

- **React 19** with TypeScript
- **Vite 6** for build tooling
- **React Router v7** for client-side routing
- **Sass** for SCSS theming
- **vite-plugin-pwa** for service worker / PWA support
- **Vitest** + **React Testing Library** for testing
- **Firebase** for hosting

## Getting Started

```bash
cd react-hn
npm install
npm run dev
```

## Build

```bash
cd react-hn
npm run build
npm run preview   # preview the production build locally
```

## Testing

```bash
cd react-hn
npm run test       # run tests once
npm run test:watch # run tests in watch mode
```

## Linting & Type Checking

```bash
cd react-hn
npm run lint
npm run typecheck
```

## Themes

Built-in theme engine with three themes:
* **Default** - Light theme
* **Night** - Dark theme
* **Black (AMOLED)** - Pure black for AMOLED displays

## Deployment

Deployed to Firebase via Travis CI. See `.travis.yml` for the CI/CD configuration.

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
