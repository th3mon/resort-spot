# Admin Panel With react-admin

## Decision

If the project gets an admin panel, it should initially be built inside the
current Next.js application under `/admin`, not as a separate service.

`react-admin` is a good candidate for that admin module, especially after the
project has database persistence with Prisma.

## Why react-admin Fits

`react-admin` is designed for resource-based admin panels. That matches the
future admin use cases well:

- maps,
- guests,
- reservations,
- cabanas,
- imported files or validation jobs.

It provides ready-made patterns for:

- resource lists,
- detail views,
- create/edit forms,
- filtering,
- sorting,
- validation,
- permissions,
- theming,
- data fetching through a Data Provider.

The most important integration point is the Data Provider. It can translate
`react-admin` operations such as `getList`, `getOne`, `create`, `update`, and
`delete` into our own `/api/admin/*` endpoints.

## Next.js Integration Notes

The admin panel can live in the existing app, but it should be treated as a
client-side admin module. `react-admin` is a SPA-oriented tool and depends on
client-side libraries such as React Router, React Query, React Hook Form, and
Material UI.

In a Next.js App Router project, the likely shape is:

```text
app/admin/page.tsx
components/admin/admin.tsx
components/admin/admin-app.tsx
components/admin/data-provider.ts
app/api/admin/maps/route.ts
app/api/admin/guests/route.ts
app/api/admin/reservations/route.ts
```

The `/admin` page should probably load the admin app dynamically with server-side
rendering disabled.

## Recommended Order

Implement Prisma first, then add the admin panel:

```text
1.3.0 - Database Persistence With Prisma
1.4.0 - Admin Panel In The Current App With react-admin
```

Without Prisma, the admin panel would mostly operate on input files and
in-memory state. That is possible, but it would make the admin experience less
realistic and less useful. With Prisma, the admin panel can manage durable
resources directly.

## Benefits Of Keeping Admin In The Current App

- One repository and one deployment.
- Shared TypeScript types and domain concepts.
- Shared Prisma models and server-side validation.
- No cross-service API design too early.
- Easier E2E testing across guest and admin workflows.
- Faster MVP for an exercise project.

## Trade-Offs

- The public UI currently avoids a component library, while `react-admin` brings
  its own UI ecosystem.
- The admin bundle and dependencies are larger than local Tailwind components.
- Admin routes need clear separation from the guest-facing map experience.
- If authentication and authorization become real requirements, security
  boundaries must be designed carefully.

This is acceptable if `react-admin` is used only for `/admin` and not mixed into
the guest-facing map UI.

## When To Consider A Separate Service

Move the admin panel into a separate service only if:

- it needs independent deployment,
- it needs strong security isolation,
- it grows into a larger operational product,
- another team owns it,
- it needs a different frontend stack,
- or its release cycle becomes independent from the guest-facing app.

Until one of those conditions is true, a separate admin service would add more
complexity than value.
