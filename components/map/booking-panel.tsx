import type { FormEvent } from "react";

export type BookingState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | { status: "unavailable"; message: string };

type BookingPanelProps = {
  selectedCabanaId: string | null;
  bookingState: BookingState;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function BookingPanel({
  selectedCabanaId,
  bookingState,
  onSubmit,
}: BookingPanelProps) {
  if (!selectedCabanaId && bookingState.status === "idle") {
    return null;
  }

  return (
    <section className="booking-panel mb-4 rounded border border-[#c9d5ca] bg-white p-4 text-sm text-[#28382d] shadow-sm">
      {selectedCabanaId ? (
        <form
          className="booking-panel__form grid gap-3 sm:max-w-xl"
          onSubmit={onSubmit}
        >
          <div className="booking-panel__header">
            <h2 className="booking-panel__title text-base font-semibold">
              Book {selectedCabanaId}
            </h2>
          </div>
          <label className="booking-panel__field grid gap-1 font-medium">
            Room number
            <input
              name="room"
              className="booking-panel__input rounded border border-[#b8c9b6] px-3 py-2 font-normal"
              autoComplete="off"
            />
          </label>
          <label className="booking-panel__field grid gap-1 font-medium">
            Guest name
            <input
              name="guestName"
              className="booking-panel__input rounded border border-[#b8c9b6] px-3 py-2 font-normal"
              autoComplete="name"
            />
          </label>
          {bookingState.status === "error" ? (
            <p
              className="booking-panel__message booking-panel__message--error text-[#6d2c21]"
              role="alert"
            >
              {bookingState.message}
            </p>
          ) : null}
          <button
            type="submit"
            className="booking-panel__action w-fit rounded border border-[#235c37] bg-[#235c37] px-4 py-2 font-semibold text-white disabled:opacity-70"
            disabled={bookingState.status === "submitting"}
          >
            {bookingState.status === "submitting"
              ? "Booking..."
              : "Book cabana"}
          </button>
        </form>
      ) : null}

      {bookingState.status === "success" ||
      bookingState.status === "unavailable" ? (
        <p
          className={
            bookingState.status === "success"
              ? "booking-panel__message booking-panel__message--success text-[#235c37]"
              : "booking-panel__message booking-panel__message--unavailable text-[#6d2c21]"
          }
          role={bookingState.status === "unavailable" ? "alert" : "status"}
        >
          {bookingState.message}
        </p>
      ) : null}
    </section>
  );
}
