# Resort Spot Implementation Roadmap

## Goal

Resort Spot is a simple web application for browsing a resort map and booking poolside cabanas. The frontend must render the map only from data returned by a REST API, while the API layer reads the map layout and guest list from files passed through CLI arguments.

The implementation should follow the code test expectations: keep the architecture small, prefer readable and idiomatic code, cover the most important behavior with automated tests, and provide one command that starts the full application.

## Technical Assumptions

- Project name: `Resort Spot`.
- Stack: Next.js + TypeScript.
- API layer: Next.js Route Handlers exposing REST endpoints.
- Frontend: React within Next.js.
- Runtime: Node.js, because the app must read local input files.
- Cabana reservation state: in-memory in the API layer.
- Input data:
  - `--map <path>` for the ASCII resort map,
  - `--bookings <path>` for the JSON guest list.
- Default input files:
  - `data/map.ascii`,
  - `data/bookings.json`.
- No real authentication; knowing the room number and guest name is enough to book.
- No persistent database, migrations, or admin panel.

## Semantic Versioning

The project should use Semantic Versioning:

- `MAJOR` - incompatible changes to the API, data model, or startup contract.
- `MINOR` - backward-compatible feature additions.
- `PATCH` - bug fixes, test fixes, documentation updates, and small improvements that do not change the contract.

Until the full code test requirements are met, the project should stay in `0.x.y` versions. Version `1.0.0` means the solution is complete and ready to submit.

## Git Flow

The project should use Git Flow as the branching model:

- `main` contains stable, submission-ready versions only.
- `develop` is the integration branch for ongoing work.
- `feature/*` branches are used for roadmap items such as `feature/map-parser`, `feature/booking-api`, or `feature/map-view`.
- `release/*` branches are used to stabilize a planned version before merging it into `main`.
- `hotfix/*` branches are reserved for urgent fixes based on `main`.

Versioning should follow the Git Flow lifecycle:

- Each roadmap milestone can be developed on one or more `feature/*` branches and merged into `develop`.
- A release branch, for example `release/1.0.0`, should be created when the implementation is feature-complete for that version.
- Final fixes, documentation updates, and release checks happen on the release branch.
- Completed releases are merged into `main`, tagged with the matching SemVer version, and merged back into `develop`.

## Roadmap

### `0.1.0` - Project Skeleton

Scope:

- Create a Next.js application with TypeScript.
- Configure linting, formatting, and basic npm scripts.
- Add a single root-level start command, for example `npm run start -- --map <path> --bookings <path>`.
- Add a small runtime configuration layer that passes input file paths to Route Handlers.
- Prepare a basic README with local run instructions.

Acceptance criteria:

- Dependencies can be installed with one standard command.
- There is a single entrypoint that starts the Next.js app with frontend and API.
- The start command accepts `--map` and `--bookings`, even if data handling is still minimal.

### `0.2.0` - API: Input Data Parsing

Scope:

- Implement the ASCII map parser.
- Validate that the map is rectangular.
- Map symbols:
  - `W` as cabana,
  - `p` as pool,
  - `#` as path,
  - `c` as chalet,
  - `.` as empty.
- Load the guest list from `bookings.json`.
- Validate guest record shape: `room` and `guestName`.

Acceptance criteria:

- The app starts with the default input files.
- The app starts with alternative input paths passed through CLI.
- Input errors are reported clearly.
- The map parser and guest loader have unit tests.

### `0.3.0` - REST API And Booking Logic

Scope:

- Add a Route Handler for reading the map and current cabana availability.
- Add a Route Handler for booking a cabana.
- Validate that the selected tile is a cabana.
- Validate that the cabana is still available.
- Validate the guest by `room` + `guestName`.
- Update in-memory reservation state after a successful booking.

Minimal API contract:

```text
GET /api/map
POST /api/cabanas/:id/book
```

In Next.js, these can map to Route Handler files such as:

```text
app/api/map/route.ts
app/api/cabanas/[id]/book/route.ts
```

Acceptance criteria:

- The API returns all data required by the frontend to render the map.
- A successful booking changes the cabana status to unavailable.
- Booking an unavailable cabana returns a readable error.
- Booking with an invalid guest returns a readable error.
- API tests cover the happy path and the most important error paths.

### `0.4.0` - Frontend: Map View

Scope:

- Fetch map data from the API.
- Render the map as a tile grid.
- Use map assets from `public/assets/`.
- Visually distinguish available and booked cabanas.
- Add a map legend.
- Handle loading and API error states.

Acceptance criteria:

- The frontend does not hardcode the map layout.
- Changes in API data change the rendered map.
- Available cabanas are clearly clickable.
- Booked cabanas are visibly distinct.

### `0.5.0` - Frontend: Booking Flow

Scope:

- Clicking an available cabana opens a simple booking form.
- The form asks for room number and guest name.
- A successful booking shows confirmation.
- The map refreshes cabana availability after booking.
- Clicking an unavailable cabana shows an availability message.
- Validation errors are short and human-readable.

Acceptance criteria:

- The user can complete the full booking flow without a page reload.
- The map updates without manual browser refresh.
- The form does not expose technical API errors.
- UI tests cover a successful booking, an invalid guest, and an unavailable cabana.

### `0.6.0` - Polish UI/UX

Scope:

- Look for good UI/UX solutions and UI libraries
- Level up UI/UX
- Add proper animations

### `0.7.0` - End-To-End Tests And Stabilization

Scope:

- Add integration or end-to-end tests for key scenarios.
- Clean up test scripts.
- Verify the app with default input files.
- Verify the app with an alternative map and guest list.
- Document design decisions in README.

Acceptance criteria:

- One command runs all tests.
- Tests cover Route Handlers, domain logic, and the most important UI behavior.
- README documents running, testing, structure, and trade-offs.

### `0.8.0` - Submission Documentation

Scope:

- Create `AI.md` describing the AI-assisted workflow.
- Add a screenshot of the running map view.
- Add final run and test instructions.
- Add a short list of known limitations.
- Run a final check against the code test requirements.

Acceptance criteria:

- The repository includes `AI.md`.
- The repository includes a map screenshot.
- README includes a single start command with `--map` and `--bookings` support.
- The documentation does not require context outside the repository.

### `1.0.0` - Submission-Ready Version

Scope:

- [x] Freeze the API contract for the code test solution.
- [x] Complete the final requirements checklist.
- [x] Remove unnecessary code, temporary files, and dead dependencies.
- [x] Mark the project as a complete recruitment task solution.

Acceptance criteria:

- [x] The app meets all functional requirements from `../ResortMapCodeTest/README.md`.
- [x] The project starts with one command from the project root.
- [x] The startup layer supports `--map` and `--bookings`.
- [x] The frontend renders the map from API data.
- [x] Cabana booking works and updates the map.
- [x] Automated tests pass.
- [x] README, `AI.md`, and `screenshot.png` are present.

## Possible Post-Submission Versions

### `1.1.0` - UX Improvements

- Better availability indicators.
- Tile tooltips.
- More polished responsive layout.
- Clearer validation and confirmation messages.

### `1.2.0` - API Extensions

- Cabana details endpoint.
- Local demo endpoint for resetting reservation state.
- More explicit frontend-facing error codes.

### `1.3.0` - Database Persistence With Prisma

Goal:

Introduce a database-backed persistence layer with Prisma while keeping the
current public guest-facing API contract stable where possible.

Recommended technology:

- Prisma ORM for schema, migrations, and typed database access.
- SQLite for local development and code-test-friendly setup.
- PostgreSQL as the likely production-ready option if the project grows beyond
  local/demo usage.

Scope:

- Add Prisma and initial `prisma/schema.prisma`.
- Model core entities:
  - `ResortMap` for named/imported maps.
  - `MapTile` for parsed tile data and coordinates.
  - `Guest` for room number and guest name records.
  - `CabanaReservation` for cabana booking state.
- Add migration scripts and Prisma Client generation.
- Seed the database from the existing `data/map.ascii` and
  `data/bookings.json` files.
- Replace in-memory reservation state with database-backed reservation state.
- Keep file parsing code as an import/seed boundary instead of removing it
  immediately.
- Add database access helpers under a focused server-side module, for example
  `domain/database` or `domain/repositories`.
- Update API Route Handlers to read map, guest, and reservation data through the
  Prisma-backed domain layer.
- Update tests to cover repository behavior and preserve existing API behavior.
- Document local database setup, migration, seed, and reset commands in README.

Acceptance criteria:

- The app can be started locally after running migrations and seed data.
- Existing `GET /api/map` and `POST /api/cabanas/:id/book` behavior still works.
- Reservations persist across app restarts.
- Guest validation reads from the database.
- Tests cover the Prisma-backed booking flow.
- README documents Prisma setup and database reset workflow.

Trade-offs:

- Database persistence adds setup cost compared with the current in-memory
  implementation.
- SQLite keeps local setup simple, but PostgreSQL should be considered before a
  real deployment.
- Moving from files to database records should be done as an additive step first,
  so reviewers can still understand how the original input files map into the
  database.

### `1.4.0` - Admin Panel In The Current App With react-admin

Decision:

Build the admin panel inside the existing Next.js application under `/admin`
instead of creating a separate service. Use `react-admin` as the admin UI
framework once Prisma-backed persistence from `1.3.0` is available.

Decision record:

- See `docs/admin-panel-react-admin.md`.

Recommended technology:

- `react-admin` for resource-based admin screens.
- A custom `react-admin` Data Provider that calls `/api/admin/*` endpoints.
- Existing Next.js App Router for hosting `/admin`.
- Prisma-backed data from `1.3.0`.

Reasoning:

- The current project is small and already combines frontend, Route Handlers,
  domain logic, and tests in one repository.
- The admin panel needs the same map, guest, and reservation concepts as the
  guest-facing app.
- Reusing the current Next.js + TypeScript stack avoids extra deployment,
  duplicated types, and cross-service API design too early.
- `react-admin` fits the planned admin resources: maps, guests, reservations,
  cabanas, imports, and validation results.
- Building the admin panel after Prisma avoids creating admin workflows around
  temporary file-backed and in-memory state.
- A separate admin service can still be extracted later if security, team
  ownership, deployment cadence, or operational complexity justify it.

Scope:

- Add an `/admin` route group or route namespace.
- Load the admin module as a client-side app where needed, keeping it isolated
  from the guest-facing map UI.
- Add a custom `react-admin` Data Provider for admin REST endpoints.
- Add admin navigation for maps, guests, and reservations.
- Add a dashboard with key counts:
  - total maps,
  - total guests,
  - total cabanas,
  - available and reserved cabanas.
- Add map management:
  - list maps,
  - view parsed map details,
  - import or validate a new ASCII map.
- Add guest management:
  - list guests,
  - inspect guest records,
  - import or validate a bookings JSON file.
- Add reservation management:
  - list current cabana reservations,
  - reset demo reservations,
  - optionally mark a cabana as reserved or available.
- Add admin-only API routes under `/api/admin/*`.
- Keep admin UI components separate from guest-facing map components where their
  workflows differ.
- Add tests for admin data loading, validation errors, and reset behavior.

Acceptance criteria:

- Admin routes are available inside the same Next.js app.
- Admin views use Prisma-backed data once `1.3.0` is complete.
- `react-admin` resources are backed by a project-owned Data Provider.
- The guest-facing booking flow keeps working unchanged.
- Admin operations have clear confirmation and error states.
- Tests cover the most important admin workflows.

Trade-offs:

- `react-admin` introduces a larger admin-specific UI ecosystem than the current
  guest-facing Tailwind components.
- This is acceptable if `react-admin` stays isolated to `/admin` and does not
  drive the public map UI.
- The public app can still avoid a component library while the admin panel uses
  one for CRUD-heavy workflows.

Future extraction criteria:

Consider splitting the admin panel into a separate service only if:

- it needs separate authentication and authorization boundaries,
- it requires independent deployment,
- it grows into a larger operational product,
- it needs a different frontend stack,
- or it must be isolated from the public guest-facing app for security reasons.

### `2.0.0` - Incompatible Changes

Examples of changes that require a major version:

- Changing the `GET /api/map` response format.
- Changing the map or bookings file format.
- Requiring persistent reservation storage.
- Introducing real authentication.

## Proposed Directory Structure

```text
.
├── app
│   ├── api
│   │   ├── cabanas
│   │   │   └── [id]
│   │   │       └── book
│   │   │           └── route.ts
│   │   └── map
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
├── docs
├── domain
│   ├── bookings.ts
│   ├── resort-map.ts
│   └── reservations.ts
├── tests
├── AI.md
├── README.md
├── next.config.ts
├── package.json
└── screenshot.png
```

The structure can be simplified if the implementation stays small. The priority is readability and easy review, not a heavy architecture. Next.js fits this task well because it keeps UI and REST API in one repository without a separate backend app, while still allowing a clear split between presentation and server-side domain behavior.

## Risks And Decisions

- Path asset selection may require logic based on neighboring tiles. Start with a simple path rendering approach, then refine tile variants after the booking flow works.
- In-memory state means reservations disappear after an app restart. This is acceptable for the task.
- Guest validation should tolerate leading/trailing whitespace and case differences.
- The API should return stable cabana IDs, preferably coordinate-based, so Next.js components do not need to infer server-side logic.
- Route Handlers must use the Node.js runtime, not Edge, because the app needs file system access.
- Tests should prove real behavior instead of only checking that components render.

## Final Checklist

- [x] One start command launches the Next.js app with frontend and API.
- [x] The start command accepts `--map` and `--bookings`.
- [x] Route Handlers read the ASCII map from a file.
- [x] Route Handlers read the guest list from a JSON file.
- [x] REST API returns map data and cabana availability.
- [x] REST API handles cabana booking.
- [x] Frontend renders the map from API data.
- [x] Frontend allows booking an available cabana.
- [x] Frontend shows unavailable state for booked cabanas.
- [x] API layer tests cover parsing, guest validation, and booking.
- [x] Frontend tests cover the core user flow.
- [x] README documents running, testing, decisions, and trade-offs.
- [x] `AI.md` describes the AI-assisted workflow.
- [x] `screenshot.png` shows the running map view.
