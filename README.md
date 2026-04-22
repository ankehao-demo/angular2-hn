# React HN

A progressive Hacker News client built with React, TypeScript, and Vite.

Migrated from the original [Angular 2 HN](https://github.com/AhsanAyaz/angular2-hn) project.

---

**Fast:** Service Worker App Shell + Dynamic Content model to achieve faster load times with and without a network.

**Responsive:** Completely responsive UI that can be installed to your mobile home screen to provide a native feel.

**Progressive:** PWA support with offline caching via vite-plugin-pwa.

## Features

- Browse top, new, show, ask, and job stories from Hacker News
- View item details with nested comment threads
- View user profiles
- Three built-in themes: Default, Night, and AMOLED Black
- Customizable font size and list spacing
- Open links in new tab option
- PWA with offline support
- Code splitting with React.lazy for item details and user pages
- Google Analytics integration

## Tech Stack

- [React](https://react.dev/) 18 with TypeScript
- [Vite](https://vitejs.dev/) for fast development and builds
- [React Router](https://reactrouter.com/) v6 for client-side routing
- [Sass](https://sass-lang.com/) with CSS Modules for styling
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for service worker and PWA capabilities
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint
npm run lint
```

## Themes

Built-in theme engine with three themes:

- **Default** - Classic red theme
- **Night** - Dark theme with cyan accents
- **AMOLED Black** - Pure black for OLED displays

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page-level components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── models/           # TypeScript interfaces
├── utils/            # Utility functions
├── styles/           # Global SCSS and theme files
├── App.tsx           # Root component with routing
└── main.tsx          # Application entry point
```

## Original Contributors

A million thanks to the original Angular project contributors:

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
