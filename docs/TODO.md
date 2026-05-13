# TODO

## Review Error Handling

The current API and domain code uses `try`/`catch` blocks and thrown exceptions
for file loading, parsing, validation, and booking failures. This works for the
current roadmap stage, but it should be revisited before the final submission.

Things to evaluate:

- Whether route handlers should avoid broad `try`/`catch` blocks.
- Whether domain functions should return explicit result objects instead of
  throwing for expected validation failures.
- Whether API errors should use a shared response helper or typed error/result
  model.
- Whether parsing and booking errors should expose stable frontend-facing error
  codes in addition to human-readable messages.
- How to keep unexpected operational errors separate from expected user errors,
  such as invalid guests or already booked cabanas.

## Consider a Resort Map Class

The current map model is a plain object with a `tiles` array. Code that needs a
specific tile or cabana has to search through that array directly, for example:

```ts
getMapWithAvailability(map).tiles[0];
```

Consider turning the parsed resort map, or the public map with availability, into
a class with lookup methods. That would allow call sites to express intent more
clearly:

```ts
getMapWithAvailability(map).getTile(tileId);
getMapWithAvailability(map).getCabana(cabanaId);
```

This could also centralize tile/cabana validation and reduce repeated
array-search logic as the API and frontend grow.
