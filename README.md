# Hacker News PWA — React

A Hacker News progressive web app built with React, TypeScript, and Vite.

## Tech Stack

- **React 18** with TypeScript
- **React Router v6** for client-side routing
- **Vite** as build tool with SCSS support
- **vite-plugin-pwa** for PWA / service worker support
- **Context API** for settings management (theme, font size, spacing)

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript type checking |

## Features

- Browse HN feeds: Top, New, Show, Ask, Jobs
- View item details with recursive comment threads
- User profiles
- Theme switching (default / night / AMOLED black)
- System dark mode detection
- Customizable font size and list spacing
- Open links in new tab option
- PWA with offline caching
- Lazy-loaded routes

## API

Uses the [node-hnapi](https://github.com/cheeaun/node-hnapi) proxy:
`https://node-hnapi.herokuapp.com`
