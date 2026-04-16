# Migrate Frontend Framework with Visual Regression Testing

## Description

Migrate an existing frontend application from one framework (e.g., Angular, Vue) to React + TypeScript while ensuring pixel-perfect visual parity. Uses Playwright-based automated screenshot capture and pixelmatch comparison to validate that the new app matches the original across all views and viewports.

## Arguments

- `$1` - Source repository URL or path (optional, defaults to current repo)
- `$2` - Target framework (optional, defaults to `react-ts`)

## What's Needed From User

Before starting, gather the following from the user (or derive from the codebase):

- **Source repository**: URL or name of the repo containing the existing frontend app
- **App description**: Brief summary of the app's features, routes, and key UI states (feed types, detail views, settings, themes, etc.)
- **API endpoint**: The backend API URL the app consumes (e.g., `https://node-hnapi.herokuapp.com`)
- **Screenshot matrix**: List of routes/states to capture, or confirmation that Devin should derive it from the app's routing
- **Viewport sizes**: Desktop and mobile dimensions (default: 1280x800 desktop, 375x812 mobile)
- **Mismatch threshold**: Maximum allowed pixel difference percentage (default: <2%)
- **Target framework**: Confirm React 18 + TypeScript, or specify alternative

## Phase 1: Run the Source App and Capture Baseline Screenshots

### Steps

1. Clone the repository (if not already cloned) and install dependencies for the existing app.

2. Start the existing app's dev server:
   ```bash
   npm install && npm start
   ```
   - If the app uses an older Node version, you may need `NODE_OPTIONS=--openssl-legacy-provider`.

3. Create a `visual-tests/` directory in the repo root and initialize a Node project:
   ```bash
   cd visual-tests && npm init -y
   npm install playwright @playwright/test pixelmatch pngjs
   npx playwright install chromium
   ```

4. Create `visual-tests/capture-source.ts` -- a Playwright script that:
   - Launches Chromium
   - Navigates to each route/state from the screenshot matrix
   - Waits for network idle and fonts to load before each screenshot (`page.waitForLoadState('networkidle')` + font ready check)
   - Waits for any CSS transitions/animations to complete (or disable them via injected stylesheet: `*, *::before, *::after { transition: none !important; animation: none !important; }`)
   - For each view, captures a full-page screenshot at both desktop and mobile viewport sizes
   - Saves screenshots to `visual-tests/screenshots/source/` with naming convention `{view-name}-{desktop|mobile}.png`

5. Run the capture script and verify all baseline screenshots are saved.

6. Review the screenshots to confirm they look correct and represent the expected UI states.

### Verification Checklist

- [ ] Source app is running and accessible
- [ ] All screenshots from the matrix are captured at both viewport sizes
- [ ] Screenshots are saved with consistent naming in `visual-tests/screenshots/source/`
- [ ] Screenshots visually match the expected app appearance

## Phase 2: Build the React + TypeScript App

### Steps

1. Scaffold the React app in a subdirectory (e.g., `react-app/`). Use whichever scaffolding tool the user prefers (Vite is recommended for new projects; CRA is acceptable for migration parity):
   ```bash
   # Option A: Vite (recommended)
   npm create vite@latest react-app -- --template react-ts
   cd react-app && npm install react-router-dom@6 sass

   # Option B: CRA
   npx create-react-app react-app --template typescript
   cd react-app && npm install react-router-dom@6 sass
   ```

2. Study the source app's architecture -- identify models, services, components, routing, and styling patterns.

3. Create TypeScript models matching the source app's data structures.

4. Map out all global state from the source app (settings, preferences, auth tokens, etc.) and create a React Context (e.g., `SettingsContext`) that:
   - Mirrors the source app's state structure and defaults
   - Persists to localStorage with the same keys so data is compatible
   - Initializes from localStorage or system preferences (e.g., `prefers-color-scheme` for dark mode)
   - Exposes the same capabilities (theme switching, font size, etc.)

5. Create an API service using native `fetch` to replicate the source app's data fetching.

6. Port the SCSS/CSS theme engine -- copy and adapt the theme mixins, variables, and global styles.

7. Build all components following the source app's component hierarchy:
   - Shared/utility components (Loader, ErrorMessage)
   - Layout components (Header, Footer, Settings panel)
   - Feature components (Feed items, Detail views, User profiles, etc.)

8. Set up routing in `App.tsx` with `react-router-dom` matching all source app routes.

9. Copy static assets (favicon, manifest, icons) from the source app.

10. Run TypeScript check (`npx tsc --noEmit`) and fix all type errors.

11. Verify the production build succeeds (`npm run build`).

### Verification Checklist

- [ ] React app compiles without TypeScript errors
- [ ] Production build succeeds
- [ ] All routes from the source app are implemented
- [ ] Theme switching works (if applicable)
- [ ] Settings persist via localStorage (if applicable)

## Phase 3: Visual Comparison and Iteration

### Steps

1. Create `visual-tests/capture-react.ts` -- a Playwright script that captures the same screenshot matrix from the React app.

2. Create `visual-tests/compare.ts` -- a comparison script using `pixelmatch` that:
   - Loads each source/react screenshot pair
   - Computes pixel mismatch percentage
   - Generates diff images highlighting differences
   - Reports pass/fail for each pair against the mismatch threshold

3. Start both the source app and the React app simultaneously.

4. Create `visual-tests/capture-both.ts` that captures from both apps in sequence, using Playwright route interception to serve identical mock API data for deterministic comparison. This ensures screenshot diffs reflect only rendering differences, not data differences.

5. Run the capture and comparison pipeline. If any failures look like data-timing issues rather than real rendering diffs, re-run with real API data to confirm.

6. **Iterate on fixes** until all screenshots pass:
   - Identify CSS scoping issues (framework-specific style encapsulation differences)
   - Fix spacing, margins, padding, font rendering, and layout differences
   - Address whitespace and text wrapping discrepancies
   - Re-run the comparison after each fix

7. Continue iterating until ALL screenshots pass with less than the mismatch threshold.

### Verification Checklist

- [ ] All screenshot pairs pass with less than the configured mismatch threshold
- [ ] Diff images show no significant visual differences
- [ ] Both desktop and mobile viewports pass for every view

## Phase 4: Create PR and Functional Testing

### Steps

1. Commit all changes and create a PR with:
   - Summary of architectural decisions
   - List of CSS scoping fixes made for visual parity
   - Description of the visual test infrastructure
   - Review checklist for the human reviewer

2. Wait for CI checks to pass.

3. Start a screen recording and perform functional end-to-end testing of the React app:
   - Navigate all feed types and verify pagination
   - Open item detail views and test interactive elements (e.g., comment collapsing)
   - Test settings/preferences (themes, font size, spacing) and verify persistence
   - Test responsive layout at mobile viewport
   - Test error states with invalid routes/IDs

4. Post functional test results as a PR comment with pass/fail table.

5. Share the PR link, test results, and any failed/untested items with the user.

### Verification Checklist

- [ ] PR is created with clear description and review checklist
- [ ] CI checks pass (or non-blocking failures are documented)
- [ ] Functional test results are posted as a PR comment
- [ ] Screen recording of functional tests is shared
- [ ] Any failures or untested items are clearly escalated to the user

## Specifications

- The React app must be a standalone subdirectory within the existing repo (not replacing the source app)
- All visual regression tests must pass with less than the configured pixel mismatch threshold (default <2%)
- The React app must replicate ALL routes, themes, settings, and responsive breakpoints from the source app
- Production build must succeed without errors
- TypeScript strict mode -- no `any` types unless absolutely necessary
- Functional test results must be posted as a structured PR comment

## Advice and Pointers

- **CSS scoping is the hardest part**: Angular uses ViewEncapsulation, Vue uses scoped styles. React's global SCSS imports cause style leakage. Use parent class scoping and child combinators (`>`) to replicate framework-specific style isolation.
- **Use `display: inline` for custom element wrappers**: Angular/Vue custom elements default to inline display. React `<div>` wrappers are block by default -- this causes layout differences.
- **Whitespace matters**: Differences in whitespace between JSX elements and template syntax can cause text wrapping differences, especially on mobile. Compare carefully.
- **Mock API data for deterministic comparison**: Use Playwright route interception to serve identical API responses to both apps during screenshot capture. This eliminates comparison failures from data differences.
- **Wait for fonts and lazy-loaded content**: Always use `page.waitForLoadState('networkidle')` and check `document.fonts.ready` before screenshots. For lazy-loaded routes, wait for the content container to appear.
- **Disable animations during capture**: Inject a stylesheet that disables all CSS transitions and animations to prevent flaky screenshot diffs.
- **`dangerouslySetInnerHTML`**: If the source app renders raw HTML (e.g., comments), the React version will need `dangerouslySetInnerHTML`. Document this in the PR for security review.
- **`--openssl-legacy-provider`**: Older Angular/Node apps may need `NODE_OPTIONS=--openssl-legacy-provider` to run.

## Forbidden Actions

- Do not delete or modify the source app's code -- the migration is additive
- Do not skip any views in the screenshot matrix
- Do not mark visual regression tests as passing if they exceed the mismatch threshold
- Do not commit screenshot image files to git -- only commit the test scripts
- Do not use `any` types in TypeScript as a shortcut
