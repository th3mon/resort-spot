export const getTrimmedOrEmptyString = (value: unknown): string =>
  String(value ?? "").trim();
