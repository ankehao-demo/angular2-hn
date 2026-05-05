# Migration Prompt: Angular 9 → React for `ankehao-demo/angular2-hn`

> Copy everything below the `---` and paste it as a single prompt to an AI coding
> assistant (or hand it to a developer) to drive the migration end-to-end.

---

## Role

You are a senior frontend engineer migrating a small but feature-complete Progressive Web App from Angular 9 to React. The goal is a **drop-in replacement** that preserves every user-visible feature (HN feeds, item/comments view, user profiles, theming, offline support, installability) while modernizing the tooling and codebase.

## Repository

- **Repo:** `ankehao-demo/angular2-hn`
- **Default branch:** `master`
- **App description:** A progressive Hacker News client originally built with Angular 9. PWA with App Shell + Workbox-style offline caching, installable via Web App Manifest, responsive UI with 3 themes (Default, Night, Black/AMOLED).

## Existing app — what you must understand before touching code

### Tooling (current)

- Angular CLI (`@angular/cli ~9.0.2`) with `@angular-devkit/build-angular ~0.900.2`
- TypeScript `~3.7.5`
- Karma + Jasmine for unit tests; Protractor for e2e
- TSLint + codelyzer
- SCSS (per-component + shared theme files in `src/app/shared/scss/`)
- Firebase Hosting (`firebase.json`, `database.rules.json`)
- Service Worker via `@angular/service-worker` (`ngsw-config.json`)

### Key dependencies (`package.json` lines 14–22)

```json
"@angular/animations":            "~9.0.1",
"@angular/common":                "~9.0.1",
"@angular/compiler":              "~9.0.1",
"@angular/core":                  "~9.0.1",
"@angular/forms":                 "~9.0.1",
"@angular/platform-browser":      "~9.0.1",
"@angular/platform-browser-dynamic": "~9.0.1",
"@angular/router":                "~9.0.1",
"@angular/service-worker":        "~9.0.1"
```

Other runtime deps: `rxjs ~6.5.4`, `rxjs-compat`, `zone.js ~0.10.2`, `node-fetch`, `unfetch`, `tslib`.

### App structure (`src/app/`)

```
src/app/
├── app.component.{ts,html,scss}
├── app.module.ts
├── app.routes.ts                 # @angular/router config (top-level routes)
├── core/                         # layout + global UI
│   ├── core.module.ts
│   ├── header/header.component.{ts,html,scss}
│   ├── footer/footer.component.{ts,html,scss}
│   └── settings/settings.component.{ts,html,scss}
├── feeds/                        # paginated HN story lists
│   ├── feed/feed.component.{ts,html,scss}
│   └── item/item.component.{ts,html,scss}      # one row in a feed
├── item-details/                 # story page + comment tree
│   ├── item-details.module.ts
│   ├── item-details.component.{ts,html,scss}
│   └── comment/comment.component.{ts,html,scss}
├── user/                         # user profile page
│   ├── user.module.ts
│   └── user.component.{ts,html,scss}
└── shared/                       # cross-cutting code
    ├── components/shared-components.module.ts
    ├── pipes/{pipes.module.ts,comment.pipe.ts}
    ├── models/{story,comment,user,settings,poll-result,feed-type.type}.ts
    ├── services/{hackernews-api.service.ts, settings.service.ts}
    └── scss/{_themes.scss, _theme_variables.scss, _media.scss}
```

### Routes (`src/app/app.routes.ts`)

| Path                  | Behavior                                                        |
| --------------------- | --------------------------------------------------------------- |
| `''`                  | Redirect to `/news/1`                                           |
| `/news/:page`         | Top stories feed (paginated)                                    |
| `/newest/:page`       | New stories feed                                                |
| `/show/:page`         | Show HN feed                                                    |
| `/ask/:page`          | Ask HN feed                                                     |
| `/jobs/:page`         | Jobs feed                                                       |
| `/item/...`           | Lazy-loaded `ItemDetailsModule` (story + comment tree)          |
| `/user/...`           | Lazy-loaded `UserModule` (user profile)                         |

Each feed route attaches `data: { feedType: 'news' \| 'newest' \| 'show' \| 'ask' \| 'jobs' }` — the `FeedComponent` reads this to call the right HN API endpoint.

### Data layer

- `shared/services/hackernews-api.service.ts` wraps the public HN Firebase REST API (`https://hacker-news.firebaseio.com/v0/...`) and returns RxJS `Observable`s for: feed lists, single items, comment trees, and user profiles.
- `shared/services/settings.service.ts` holds theme + UI preferences (persisted to `localStorage`). Components subscribe to it for live theme switching.

### PWA assets

- `src/manifest.json` — Web App Manifest (name, icons in `src/assets/icons/`, theme color `#b92b27`, `display: standalone`, `start_url: "./?utm_source=web_app_manifest"`).
- `ngsw-config.json` — Angular Service Worker config: prefetches app shell + lazy-caches assets.
- `angular.json` has `"serviceWorker": true` for the production build.

### Hosting / CI

- `firebase.json` configures Firebase Hosting with SPA rewrites (everything → `/index.html`).
- `.travis.yml` (legacy) builds and deploys.

---

## Migration requirements

### Stack (target)

| Concern              | From                                | To                                                     |
| -------------------- | ----------------------------------- | ------------------------------------------------------ |
| Framework            | Angular 9 (NgModules + components)  | **React 18+** with **functional components + hooks**   |
| Language             | TypeScript 3.7                      | **TypeScript 5+** (keep TS — do **not** drop it)       |
| Build tool           | Angular CLI / ejected Webpack       | **Vite + `@vitejs/plugin-react`** (preferred). CRA or Next.js are acceptable only if explicitly justified. |
| Routing              | `@angular/router`                   | **`react-router-dom` v6**                              |
| Data fetching        | RxJS `Observable` + Angular service | **TanStack Query (React Query) v5** *or* SWR — pick one and stick with it |
| Service worker / PWA | `@angular/service-worker` + ngsw    | **Workbox directly** (e.g. `vite-plugin-pwa` with Workbox under the hood, or hand-rolled Workbox config) |
| Styling              | Component-scoped SCSS               | Keep SCSS; per-component CSS Modules (`*.module.scss`) preferred. Preserve theme variables and dark/AMOLED themes. |
| Unit testing         | Karma + Jasmine                     | **Jest + React Testing Library** (Vitest is acceptable if Vite is used; if so, justify and configure it to behave like Jest) |
| E2E testing          | Protractor                          | Out of scope unless trivially portable; if migrating, use Playwright. Otherwise document removal in the README. |
| Linting              | TSLint + codelyzer                  | **ESLint** with `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks` |
| Formatting           | Prettier (already in use)           | Keep Prettier; preserve existing `.prettierrc`-equivalent settings from `package.json` |

### Functional parity (non-negotiable)

The migrated app **must** preserve every one of the following:

1. **Feeds:** `/news/:page`, `/newest/:page`, `/show/:page`, `/ask/:page`, `/jobs/:page` — same URLs, same pagination behavior, same per-row rendering as the current `FeedItemComponent`.
2. **Item details:** `/item/:id` — story header + nested comment tree (preserve collapse/expand behavior if present in the Angular version).
3. **User profile:** `/user/:id` — karma, about, submitted item count.
4. **Settings:** theme switching (Default / Night / AMOLED Black) persisted to `localStorage`, with live application across the whole app.
5. **PWA:**
   - Web App Manifest with the same `name`, `short_name`, icon set, theme color, and `start_url`.
   - Installable on Chromium-based browsers.
   - Offline support: app shell + previously visited feed/item pages must load offline. Use Workbox runtime caching strategies (`StaleWhileRevalidate` for HN API JSON, `CacheFirst` for static assets, `NetworkFirst` for navigation requests).
6. **Responsive design:** preserve all current breakpoints (`shared/scss/_media.scss`).
7. **SPA fallback for hosting:** keep Firebase Hosting rewrites — or document the equivalent for whatever host is used.

### Non-functional requirements

- **No regressions in Lighthouse PWA score** (current is ~87/100).
- **Bundle size budget:** initial JS payload must not exceed ~1.5× the current Angular production bundle.
- **TypeScript strictness:** enable `"strict": true` in `tsconfig.json`. Address any pre-existing implicit-`any` issues during migration.
- **No `any` shortcuts** in new code. Type the HN API responses properly using the existing models in `src/app/shared/models/` as a reference.
- **No business-logic changes** unless required to bridge an Angular-only construct. Document any deviations in the PR description.

---

## Plan of attack (recommended order)

Do this incrementally. Do **not** delete the Angular app until the React app is at parity.

1. **Scaffold** a new Vite + React + TS app under `react-app/` at the repo root.
   - Add `@vitejs/plugin-react`, `react-router-dom@6`, `@tanstack/react-query@5` (or `swr`), `vite-plugin-pwa`, `sass`, ESLint config, Jest/Vitest + RTL.
2. **Port shared layer first** (zero UI risk):
   - `shared/models/*.ts` → `react-app/src/lib/models/*.ts` (interfaces only, drop Angular decorators).
   - `shared/services/hackernews-api.service.ts` → `react-app/src/lib/api/hn.ts` as plain `async` functions returning typed promises (no RxJS).
   - Wrap each in a React Query hook (`useFeed(type, page)`, `useItem(id)`, `useUser(id)`).
   - `shared/services/settings.service.ts` → React Context (`SettingsProvider`) + `useSettings()` hook backed by `localStorage`.
3. **Port styles:** copy `shared/scss/{_themes.scss,_theme_variables.scss,_media.scss}` and global `styles.scss` into the new app. Confirm theme switching works at the root via a `data-theme` attribute or class on `<html>` / `<body>`.
4. **Port layout:** `core/header`, `core/footer`, `core/settings` → React components. Use the existing HTML/SCSS as a starting point.
5. **Port routes & feature pages** in this order:
   1. `/news/:page` (FeedComponent) — verify pagination, per-row rendering.
   2. Other feeds (`/newest`, `/show`, `/ask`, `/jobs`) — share a single `<FeedPage>` parameterized by `feedType`.
   3. `/item/:id` — story + recursive `<Comment>` component for the comment tree.
   4. `/user/:id`.
6. **PWA wiring:**
   - Move `src/manifest.json` content into `vite-plugin-pwa`'s `manifest` option (or keep a static `public/manifest.webmanifest`).
   - Configure Workbox via `vite-plugin-pwa`'s `workbox` option (or write a standalone `workbox-config.js`).
   - Verify with Lighthouse: installable + offline-capable.
7. **Swap hosting target:** update `firebase.json` `public` directory to the React build output (`react-app/dist`) and keep SPA rewrites. Update README accordingly.
8. **Cutover:** once the React app passes manual + automated tests at parity, move it to the repo root (or keep `react-app/` and update CI). Remove Angular sources, `angular.json`, `karma.conf.js`, `tslint.json`, `tsconfig.app.json`, `tsconfig.spec.json`, Angular `node_modules`, etc., in a final dedicated commit.
9. **README & docs:** rewrite the README to reflect the React stack (install/build/test/start commands, deploy, how the PWA is configured). Remove Angular-specific instructions.

---

## Output expectations (definition of done)

A reviewer should be able to:

1. `git clone` the repo, `npm install` (or `pnpm`/`yarn` — pick one and document), and run **one** command to start the dev server.
2. Navigate every route in the table above and see the same content as the original Angular app.
3. Toggle themes and have them persist across reloads.
4. Build the production bundle, install the app on Chrome (mobile or desktop), go offline, and still load previously visited pages.
5. Run `npm test` and see a green Jest/RTL suite covering at minimum:
   - The HN API client (mocked `fetch`).
   - The feed page (renders rows from a mocked query).
   - The item-details page (renders nested comments).
   - The settings/theme context (toggle + persistence).
6. Run `npm run lint` and `tsc --noEmit` cleanly.

### Concrete deliverables

- [ ] Working React + TS app (Vite preferred) at parity with the Angular app.
- [ ] Updated `package.json` with the new dependency tree (no leftover Angular packages once cutover is complete).
- [ ] React Router v6 configuration matching the original route table 1:1.
- [ ] React Query (or SWR) hooks replacing the Angular HN API service.
- [ ] Workbox-based service worker + Web App Manifest preserving offline + installability.
- [ ] Jest (or Vitest) + React Testing Library suite, with the tests listed above.
- [ ] ESLint + Prettier configuration; CI lint+test passing.
- [ ] Updated `README.md` describing the new stack, commands, and deploy.
- [ ] PR description that documents:
  - Any deliberate deviations from the original behavior.
  - Lighthouse before/after numbers.
  - Bundle-size before/after.

---

## Constraints & guardrails

- **Do not** drop TypeScript. **Do not** introduce `any` to silence type errors.
- **Do not** rewrite features that already work — port them.
- **Do not** delete the Angular code until React parity is verified.
- **Do not** break the Web App Manifest contract (`name`, icons, `start_url`, `theme_color`).
- **Do not** silently change URL shapes — the route table above is the contract.
- **Do** keep commits small and reviewable, ideally one per step in the plan.
- **Do** add a CHANGELOG entry (or PR description section) summarizing user-visible changes (there should be none beyond performance).
- **Do** ask before introducing a heavy state-management library (Redux, Zustand, Jotai). Default to React Query + Context; only escalate if a concrete need emerges.

---

## Reference files to read first

When you start, read these in order to ground yourself:

1. `package.json` (root) — current dependency surface.
2. `src/app/app.routes.ts` — route contract.
3. `src/app/shared/services/hackernews-api.service.ts` — every API call you must reproduce.
4. `src/app/shared/models/*.ts` — domain types.
5. `src/app/shared/services/settings.service.ts` — theme/preferences contract.
6. `src/app/shared/scss/_themes.scss` and `_theme_variables.scss` — theme tokens.
7. `ngsw-config.json` and `src/manifest.json` — PWA contract.
8. `angular.json` — to understand the production build (assets, styles, service worker flag).
9. `firebase.json` — hosting + SPA rewrites.

---

## Suggested initial commands

```bash
# from repo root
npm create vite@latest react-app -- --template react-ts
cd react-app
npm install react-router-dom@6 @tanstack/react-query
npm install -D vite-plugin-pwa workbox-window sass
npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
# (or: vitest @testing-library/react @testing-library/jest-dom jsdom)
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks prettier
```

When in doubt, prefer the simplest, most idiomatic React solution. Ship working code over clever code.
