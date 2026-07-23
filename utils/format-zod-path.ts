export const formatZodPath = (path: PropertyKey[]): string =>
  path.map(String).join(".");
