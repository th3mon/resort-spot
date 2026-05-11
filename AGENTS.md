<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project Context

Resort Spot is a code test project for an interactive resort map and cabana booking web app.

The application should:

- Render a resort map from data served by a REST API.
- Let guests book available cabanas.
- Validate bookings using room number and guest name from the provided bookings file.
- Keep cabana reservation state in memory.
- Run as a simple Next.js + TypeScript application.

Source task materials live outside this project directory in:

- `../ResortMapCodeTest/README.md`

Default input data and map assets have been copied into this project:

- `data/map.ascii`
- `data/bookings.json`
- `public/assets/`

Additional planning notes live in:

- `docs/road-map.md`

## Implementation Guidelines

- Prefer simple, readable code over clever abstractions.
- Use Next.js Route Handlers for REST API endpoints.
- Keep route handlers thin; put domain behavior in `domain/`.
- Use `domain/resort-map.ts` for parsing and representing the ASCII map.
- Use `domain/bookings.ts` for loading and validating guests.
- Use `domain/reservations.ts` for in-memory cabana reservation behavior.
- Keep UI components in `components/` when they are reused or make `app/page.tsx` too large.
- Do not persist cabana reservations to a database unless the task requirements change.
- Do not hardcode the map layout in the frontend.

## Expected API Shape

Minimum API:

```text
GET /api/map
POST /api/cabanas/:id/book
```

The API should return all information needed by the frontend to render the map, including cabana availability.

Cabana IDs should be stable. Prefer coordinate-based IDs, for example `cabana-11-3`.

## CLI And Runtime

The final project must provide one command from the project root that starts the full app.

That command must accept:

```text
--map <path>
--bookings <path>
```

Default inputs should point to the provided files in `data/`:

```text
data/map.ascii
data/bookings.json
```

Route Handlers must run in the Node.js runtime because they need access to local files.

## Testing Expectations

Cover the important behavior, not just boilerplate:

- ASCII map parsing and validation.
- Guest validation by room and guest name.
- Successful cabana booking.
- Rejection of invalid guests.
- Rejection of already booked cabanas.
- UI behavior for viewing the map and booking a cabana.

## Deliverables

Before considering the project complete, ensure the repository includes:

- `README.md` with setup, run, test, design decisions, and trade-offs.
- `AI.md` describing the AI-assisted workflow.
- `screenshot.png` showing the running map view.
- Automated tests for API/domain logic and core UI behavior.
- A single start command that supports `--map` and `--bookings`.

## Versioning And Branching

Use Semantic Versioning:

- `0.x.y` while the implementation is incomplete.
- `1.0.0` for the complete code test submission.
- Increment `MINOR` for compatible features.
- Increment `PATCH` for fixes and documentation-only changes.
- Reserve `MAJOR` for incompatible API, data format, or startup contract changes.

Use Git Flow:

- `main` contains stable, submission-ready versions.
- `develop` is the integration branch.
- `feature/*` branches contain focused implementation work.
- `release/*` branches stabilize planned versions.
- `hotfix/*` branches are reserved for urgent fixes from `main`.

When bumping the npm package version, use:

```bash
npm run version:bump -- <version-or-semver-step>
```

This wrapper passes `--no-git-tag-version` to `npm version`. Git Flow owns
release commits and tags in this repository, so npm should only update
`package.json` and `package-lock.json`; the release tag is created later by
`git flow release finish`.
