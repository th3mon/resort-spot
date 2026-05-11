export function errorMessageFor(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
