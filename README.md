# React HN

A progressive Hacker News client built with React, TypeScript, and Vite.

Migrated from the original [Angular 9 HN PWA](https://github.com/nicholasbraun/angular2-hn).

## Features

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router v7** for client-side routing
- **PWA support** via vite-plugin-pwa with service worker
- **SCSS theming** with support for default, night, and AMOLED black themes
- **Lazy loading** for ItemDetails and User pages
- **Settings** for theme, font size, list spacing, and link behavior
- **Google Analytics** page tracking

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm test
```

## Project Structure

```
src/
  components/     # Reusable UI components (Header, Footer, Settings, FeedItem, Comment, Loader, ErrorMessage)
  pages/          # Route-level page components (Feed, ItemDetails, User)
  hooks/          # Custom hooks (useHackerNewsApi, usePageTracking)
  context/        # React Context providers (SettingsContext)
  types/          # TypeScript interfaces and types
  styles/         # Global SCSS styles and theme system
  utils/          # Utility functions (formatComment)
```

## API

Uses the [Hacker News API](https://node-hnapi.herokuapp.com) for data fetching.

## License

[MIT](LICENSE.md)
