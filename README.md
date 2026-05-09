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

The project has been scaffolded with `create-next-app` and is currently in the early implementation phase.

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

## Planned Run Contract

The final submission must provide one command from the project root that starts the full app and accepts:

```text
--map <path>
--bookings <path>
```

Default paths should point to:

```text
data/map.ascii
data/bookings.json
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
```
