import type { CabanaReservation, PublicResortMap } from "@/domain/reservations";

type BookingRequestBody = {
  room: string;
  guestName: string;
};

type BookingResponseBody =
  | { reservation: CabanaReservation }
  | { error: string };

export async function loadMap(signal?: AbortSignal): Promise<PublicResortMap> {
  const response = await fetch<PublicResortMap>("/api/map", {
    cache: "no-store",
    signal,
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(errorMessageFrom(body));
  }

  return body;
}

export async function bookSelectedCabana(
  cabanaId: string,
  body: BookingRequestBody,
): Promise<CabanaReservation> {
  const response = await fetch<BookingResponseBody>(
    `/api/cabanas/${encodeURIComponent(cabanaId)}/book`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(bookingErrorMessageFrom(response.status, responseBody));
  }

  if (!hasReservation(responseBody)) {
    throw new Error("Unable to complete booking. Please try again.");
  }

  return responseBody.reservation;
}

const errorMessageFrom = (body: unknown): string =>
  hasErrorMessage(body) ? body.error : "Unable to load the resort map.";

const hasErrorMessage = (value: unknown): value is { error: string } =>
  typeof value === "object" &&
  value !== null &&
  "error" in value &&
  typeof value.error === "string";

function bookingErrorMessageFrom(
  status: number,
  body: BookingResponseBody,
): string {
  if (status === 400) {
    return "Enter a room number and guest name.";
  }

  if (status === 403 && hasErrorMessage(body)) {
    return body.error;
  }

  if (status === 409) {
    return "That cabana is no longer available.";
  }

  return "Unable to complete booking. Please try again.";
}

const hasReservation = (
  value: unknown,
): value is { reservation: CabanaReservation } =>
  typeof value === "object" && value !== null && "reservation" in value;
