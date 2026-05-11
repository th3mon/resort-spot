# Resort Spot

Resort Spot is a Next.js + TypeScript code test project for an interactive resort map and cabana booking flow.

The app will render a resort map from REST API data, let guests book available cabanas, validate guests against the provided bookings file, and keep reservation state in memory.

## Source Materials

Default input data and map assets:

```text
data/map.ascii
data/bookings.json
public/assets/
```

## Current Status

The project has a Next.js + TypeScript skeleton, basic lint/test scripts, and
a CLI-aware start layer for the input file paths required by the code test.

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

## Planned Architecture

```text
app/
  api/
    map/route.ts
    cabanas/[id]/book/route.ts
components/
domain/
  bookings.ts
  resort-map.ts
  reservations.ts
docs/
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
npm run version:bump -- patch
npm run version:bump -- 0.1.1
npm run test
npm run test:ci
```

Use `npm run version:bump -- <version-or-semver-step>` instead of calling
`npm version` directly. The script always passes `--no-git-tag-version` because
Git Flow owns release commits and tags. In this project, npm should only update
the version fields in `package.json` and `package-lock.json`; the release tag is
created later by `git flow release finish`.
