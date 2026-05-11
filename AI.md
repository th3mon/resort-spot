# AI-Assisted Workflow

This project was developed with AI assistance in an iterative, review-driven
workflow. The assistant followed the repository instructions in `AGENTS.md`, the
implementation plan in `docs/road-map.md`, and the project preference for small,
readable changes over broad abstractions.

## Collaboration Model

Work was organized around roadmap milestones and Git Flow:

- `develop` was used as the integration branch.
- Feature work was started with `git flow feature start <name> develop`.
- Releases were created with `git flow release start <version> develop`.
- Version bumps were kept on release branches rather than feature branches.
- Release tagging was left to Git Flow instead of `npm version`.

The user reviewed implementation details throughout the process and corrected
project preferences when needed. Those preferences were then added to
`AGENTS.md` so future work can follow the same conventions.

## AI Contributions So Far

The assistant helped implement the initial project skeleton for `0.1.0`:

- Added a CLI-aware start wrapper in `scripts/start.mjs`.
- Supported `--map <path>` and `--bookings <path>` for both `npm run start` and
  `npm run dev`.
- Added runtime configuration in `domain/runtime-config.ts`.
- Added a Node.js Route Handler at `GET /api/runtime`.
- Replaced the default generated home page with a simple Resort Spot placeholder.
- Updated README instructions for local setup and runtime input paths.

The assistant helped add formatting support in `0.1.1`:

- Added Prettier and explicit formatting configuration.
- Added `npm run format` and `npm run format:check`.
- Added `npm run version:bump -- <version-or-semver-step>`.
- Documented why `--no-git-tag-version` is used: Git Flow owns release commits
  and tags, while npm should only update `package.json` and `package-lock.json`.

The assistant helped implement and stabilize the `0.2.0` input parsing feature:

- Added ASCII resort map parsing in `domain/resort-map.ts`.
- Validated rectangular maps and supported the required symbols:
  `W`, `p`, `#`, `c`, and `.`.
- Added guest booking JSON parsing and record validation in `domain/bookings.ts`.
- Introduced Zod for guest booking shape validation while keeping user-facing
  error messages concise and domain-specific.
- Added Lodash utilities where the project owner preferred them for readability.
- Extended `GET /api/runtime` so it validates configured input files and reports
  parsed map and booking counts.
- Added unit tests for map parsing, guest parsing, file loading, and error
  reporting.
- Created and finished the `0.2.0` release through Git Flow.

The assistant started the `0.3.0` booking API feature:

- Added `GET /api/map` to return parsed map data with cabana availability.
- Added `POST /api/cabanas/:id/book` to reserve a cabana for a validated guest.
- Added `domain/reservations.ts` for in-memory reservation state.
- Kept route handlers thin by delegating booking rules to the domain layer.
- Added tests for reservation behavior and API route handlers.
- Confirmed through a local smoke test that booking a cabana changes its
  availability in subsequent `GET /api/map` responses.

Current reservation state intentionally stores only which cabana IDs are
reserved. It does not store or expose who reserved a cabana yet; adding that
would require changing the in-memory state from a set of cabana IDs to a
reservation record map.

## Project Conventions Captured During AI Work

The user clarified several preferences during implementation:

- Use `console.log()` for CLI usage output in `scripts/start.mjs`.
- Prefer helper functions below the functions or methods that use them, so files
  read from primary behavior down into supporting details.
- Keep version bumps on release branches.
- Use `npm version --no-git-tag-version` through the project script instead of
  allowing npm to create its own commits or tags.
- Keep temporary files created by tests out of the repository and remove them
  deterministically after each test.
- Treat `room + guestName` as guest validation data, not as a mapping from rooms
  to specific cabanas.
- Keep the ASCII resort map parser hand-written rather than forcing Zod into
  text parsing where it adds little value.

These conventions were either applied directly or documented in `AGENTS.md`.

## Documentation And Verification

Before writing Next.js Route Handler code, the assistant checked the local
Next.js documentation in `node_modules/next/dist/docs/` because this project uses
Next.js 16 and the repository explicitly warns that framework behavior may differ
from older versions.

The assistant regularly verified changes with:

```bash
npm run format:check
npm run lint
npm run test:ci
npm run build
```

For runtime validation, the assistant also started the app and queried
`GET /api/runtime` with both default and alternative input file paths.

For the booking API feature, the assistant also smoke-tested:

- `GET /api/map`
- `POST /api/cabanas/:id/book`
- a follow-up `GET /api/map` confirming the booked cabana became unavailable

## Human Oversight

The user made or requested several corrections that shaped the final direction:

- Changed CLI usage output style.
- Asked for explicit Prettier options that are valuable for this project.
- Requested documentation for `--no-git-tag-version`.
- Corrected the release workflow so version numbers are changed on release
  branches, not on `develop` before creating a release.
- Requested deterministic cleanup for test-created temporary files.
- Asked whether cabana reservations should expose the reserving guest; the
  current implementation does not, and that trade-off is now explicit.

The AI assistance was therefore used as an implementation accelerator, while the
project owner retained architectural and process control.
