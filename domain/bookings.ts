export type GuestBooking = {
  room: string;
  guestName: string;
};

const normalizeGuestField = (value: string) => value.trim().toLowerCase();

export function guestMatchesBooking(
  bookings: GuestBooking[],
  room: string,
  guestName: string,
) {
  const normalizedRoom = normalizeGuestField(room);
  const normalizedGuestName = normalizeGuestField(guestName);

  return bookings.some(
    (booking) =>
      normalizeGuestField(booking.room) === normalizedRoom &&
      normalizeGuestField(booking.guestName) === normalizedGuestName,
  );
}
