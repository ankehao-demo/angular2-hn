# MIGRATE-001: Initialize React + TypeScript Project with Vite

**Type:** Task
**Priority:** High
**Epic:** Angular to React Migration
**Phase:** Phase 1 - Project Scaffolding
**Story Points:** 2

---

## Summary

Initialize a new React + TypeScript project using Vite as the build tool in the `ankehao-demo/angular2-hn` repository, replacing the existing Angular CLI build setup.

## Description

As the first step of migrating the Angular Hacker News PWA to React, we need to scaffold a new React + TypeScript project using Vite. This sets up the foundation for all subsequent migration work.

The current project uses Angular CLI (`angular.json`) with TypeScript. The new project will use Vite with the `react-ts` template, which provides:
- React 18+ with TypeScript support
- Fast HMR (Hot Module Replacement) during development
- Optimized production builds
- Native ESM-based dev server

## Acceptance Criteria

- [ ] A new Vite + React + TypeScript project is initialized in the repository (on a migration branch)
- [ ] Running `npm run dev` starts the Vite dev server and renders a default React page
- [ ] Running `npm run build` produces a production build without errors
- [ ] `tsconfig.json` is configured for React JSX (`"jsx": "react-jsx"`)
- [ ] The following files are created/updated:
  - `vite.config.ts` — Vite configuration with React plugin
  - `index.html` — Vite entry HTML (at project root, not `src/`)
  - `src/main.tsx` — React entry point
  - `src/App.tsx` — Placeholder App component
  - `package.json` — Updated with React, React DOM, Vite, and related devDependencies
  - `tsconfig.json` — Updated for React/Vite compatibility
  - `tsconfig.node.json` — For Vite config TypeScript support

## Steps to Complete

1. Create a new branch: `feat/migrate-to-react`
2. Run `npm create vite@latest . -- --template react-ts` (or manually set up equivalent config if scaffolding in an existing directory)
   - If the existing directory conflicts, scaffold in a temp directory and copy files over
3. Ensure `package.json` includes at minimum:
   - **dependencies:** `react`, `react-dom`
   - **devDependencies:** `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `typescript`, `vite`
4. Verify `vite.config.ts` includes the React plugin:
   ```ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
   })
   ```
5. Verify `index.html` is at the project root with a `<div id="root"></div>` and a `<script type="module" src="/src/main.tsx"></script>`
6. Verify `src/main.tsx` renders a basic React component into `#root`
7. Run `npm install` and confirm `npm run dev` and `npm run build` both succeed
8. Commit and push to the migration branch

## Notes

- Do NOT remove Angular source files yet — that happens in Phase 12 (Cleanup). The Angular and React code will coexist temporarily during migration.
- The existing `src/app/` directory (Angular code) should remain untouched in this ticket.
- Subsequent tickets will add routing (`react-router-dom`), SCSS (`sass`), and PWA support (`vite-plugin-pwa`) as additional dependencies.

## Dependencies

- None (this is the first ticket in the migration)

## Blocks

- All subsequent migration tickets (Phase 1 Steps 2-4, Phases 2-12)
