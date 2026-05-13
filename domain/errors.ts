export type BookingErrorCode =
  | "not-cabana"
  | "already-booked"
  | "invalid-guest";

export class BookingError extends Error {
  constructor(
    public readonly code: BookingErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "BookingError";
  }
}

export function statusForBookingError(error: unknown) {
  if (!(error instanceof BookingError)) {
    return 500;
  }

  if (error.code === "already-booked") {
    return 409;
  }

  if (error.code === "invalid-guest") {
    return 403;
  }

  return 404;
}

export function errorMessageFor(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
