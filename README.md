# React HN

A progressive web app (PWA) Hacker News client built with **React**, **TypeScript**, and **Vite**.

Migrated from the original Angular 9 implementation to a modern React stack.

## Tech Stack

- **React 19** with TypeScript
- **Vite 8** for fast development and builds
- **React Router 7** for client-side routing with lazy loading
- **SCSS** for styling with theme support (default, night, AMOLED black)
- **Workbox** (via vite-plugin-pwa) for service worker and offline support
- **React Context API** for settings state management

## Features

- Browse Hacker News feeds: Top, New, Show, Ask, Jobs
- View item details with nested/threaded comments
- View user profiles
- Poll rendering with vote percentage bars
- 3 themes: Default (red), Night (blue), AMOLED Black
- Customizable font size and list spacing
- Open links in new tab option
- System dark mode auto-detection
- PWA: installable, offline-capable, cached API responses
- Responsive design for mobile and desktop
- Code splitting with lazy-loaded routes
- Google Analytics integration

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
```

## Project Structure

```
src/
  components/    # Reusable UI components (Header, Footer, ItemCard, Comment, etc.)
  context/       # React Context providers (SettingsContext)
  pages/         # Route page components (FeedPage, ItemDetailsPage, UserPage)
  services/      # API service layer (hackerNewsApi)
  styles/        # Global SCSS, theme variables, media queries
  types/         # TypeScript interfaces (Story, Comment, User, etc.)
  utils/         # Utility functions
  router.tsx     # Route configuration
  main.tsx       # App entry point
public/
  assets/        # Icons, images
  manifest.json  # PWA manifest
```
