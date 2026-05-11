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

### `0.6.0` - End-To-End Tests And Stabilization

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

### `0.7.0` - Submission Documentation

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

- Freeze the API contract for the code test solution.
- Complete the final requirements checklist.
- Remove unnecessary code, temporary files, and dead dependencies.
- Mark the project as a complete recruitment task solution.

Acceptance criteria:

- The app meets all functional requirements from `../ResortMapCodeTest/README.md`.
- The project starts with one command from the project root.
- The startup layer supports `--map` and `--bookings`.
- The frontend renders the map from API data.
- Cabana booking works and updates the map.
- Automated tests pass.
- README, `AI.md`, and `screenshot.png` are present.

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

- [ ] One start command launches the Next.js app with frontend and API.
- [ ] The start command accepts `--map` and `--bookings`.
- [ ] Route Handlers read the ASCII map from a file.
- [ ] Route Handlers read the guest list from a JSON file.
- [ ] REST API returns map data and cabana availability.
- [ ] REST API handles cabana booking.
- [ ] Frontend renders the map from API data.
- [ ] Frontend allows booking an available cabana.
- [ ] Frontend shows unavailable state for booked cabanas.
- [ ] API layer tests cover parsing, guest validation, and booking.
- [ ] Frontend tests cover the core user flow.
- [ ] README documents running, testing, decisions, and trade-offs.
- [ ] `AI.md` describes the AI-assisted workflow.
- [ ] `screenshot.png` shows the running map view.
