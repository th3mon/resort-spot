# Resort Spot

Resort Spot is a Next.js + TypeScript code test project for an interactive resort map and cabana booking flow.

The app renders a resort map from REST API data, lets guests book available cabanas, validates guests against the provided bookings file, and keeps reservation state in memory.

## Source Materials

Default input data and map assets:

```text
data/map.ascii
data/bookings.json
public/assets/
```

## Current Status

The project has a Next.js + TypeScript implementation with API routes, domain parsing and booking logic, frontend map rendering, unit/component tests, and Playwright end-to-end tests.

See [docs/road-map.md](docs/road-map.md) for the implementation roadmap, Semantic Versioning plan, and Git Flow notes.

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run the development server with explicit input files:

```bash
npm run dev -- --map data/map.ascii --bookings data/bookings.json
```

## Submission Run

From the project root, build and start the full frontend and backend with one
runtime command:

```bash
npm run build
npm run start -- --map data/map.ascii --bookings data/bookings.json
```

Then open [http://localhost:3000](http://localhost:3000).

## Run Contract

The app provides one root-level start command. It accepts map and bookings file
paths and passes them to the server runtime:

```bash
npm run build
npm run start -- --map data/map.ascii --bookings data/bookings.json
```

The same flags also work in development:

```bash
npm run dev -- --map data/map.ascii --bookings data/bookings.json
```

If the flags are omitted, the defaults are:

- `data/map.ascii`
- `data/bookings.json`

The current runtime input values can be checked at:

```text
GET /api/runtime
```

The runtime endpoint also validates the configured input files. A successful
response includes the parsed map dimensions, tile count, and guest count. Input
errors include the affected file path and a short reason.

## API

Read the parsed map and current cabana availability:

```text
GET /api/map
```

Book an available cabana:

```text
POST /api/cabanas/:id/book
Content-Type: application/json

{
  "room": "101",
  "guestName": "Alice Smith"
}
```

Reservations are kept in memory and reset when the app process restarts.

## Project Structure

```text
app/
  api/
    map/route.ts
    cabanas/[id]/book/route.ts
components/
  map/
domain/
  bookings.ts
  resort-map.ts
  reservations.ts
docs/
e2e/
  fixtures/
utils/
```

Route Handlers should stay thin and delegate domain behavior to `domain/`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:check
npm run playwright:install
npm run version:bump -- patch
npm run version:bump -- 0.1.1
npm run test
npm run test:ci
npm run test:e2e
npm run test:e2e:alternative
npm run test:e2e:ui
npm run check:all
```

Install the Playwright Chromium browser before running E2E tests for the first time:

```bash
npm run playwright:install
```

Run all unit, component, API, and build checks:

```bash
npm run check:all
```

Run browser-level E2E checks separately:

```bash
npm run test:e2e
```

Use `npm run version:bump -- <version-or-semver-step>` instead of calling
`npm version` directly. The script always passes `--no-git-tag-version` because
Git Flow owns release commits and tags. In this project, npm should only update
the version fields in `package.json` and `package-lock.json`; the release tag is
created later by `git flow release finish`.

## End-To-End Tests

Playwright tests live in `e2e/`.

Default E2E tests start the production Next.js server with default input files:

```bash
npm run test:e2e
```

Alternative input coverage uses:

```text
e2e/fixtures/map.ascii
e2e/fixtures/bookings.json
```

Run only the alternative input E2E test:

```bash
npm run test:e2e:alternative
```

Open the Playwright UI runner:

```bash
npm run test:e2e:ui
```

## Trade-Offs And Limitations

- Reservations are stored in memory and reset when the app process restarts.
- There is no database or persistent storage.
- There is no authentication; room number and guest name are enough for this code test.
- Runtime input paths are provided through CLI arguments and exposed to Route Handlers through environment variables.
- The frontend renders the map from API data and does not hardcode the map layout.
- The booking flow does not use a global store library. The current UI state is local to the map experience, so React state keeps the implementation smaller than adding Redux, Zustand, Jotai, or a similar dependency.
- The UI does not use a component library. The interface is small and domain-specific, so Tailwind CSS and focused local components keep the bundle and implementation lighter than adding a full UI kit.
- E2E tests cover the most important browser-level flows; domain logic and Route Handlers remain covered by Vitest.
- The project keeps the API small: `GET /api/map` and `POST /api/cabanas/:id/book` cover the required flow.
- E2E tests are intentionally run separately from `npm run check:all` because they are slower and require browser setup.

## Submission Checklist

- Source code is in this repository.
- `AI.md` documents the AI-assisted workflow.
- `screenshot.png` shows the running map view.
- `npm run start -- --map <path> --bookings <path>` starts the full app after build.
- Automated tests cover domain logic, API behavior, UI behavior, and key E2E flows.
