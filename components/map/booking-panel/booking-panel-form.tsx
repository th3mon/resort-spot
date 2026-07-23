import { BookingPanelErrorMessage } from "./booking-panel-error-message";
import type { BookingState, BookingSubmitHandler } from "./booking-panel-types";

type BookingPanelFormProps = {
  selectedCabanaId: string;
  bookingState: BookingState;
  onSubmit: BookingSubmitHandler;
};

export const BookingPanelForm = ({
  selectedCabanaId,
  bookingState,
  onSubmit,
}: BookingPanelFormProps) => (
  <form
    className="booking-panel__form grid gap-4 sm:max-w-2xl"
    onSubmit={onSubmit}
  >
    <div className="booking-panel__header">
      <h2 className="booking-panel__title text-base font-semibold">
        Book {selectedCabanaId}
      </h2>
    </div>

    <div className="booking-panel__fields grid gap-3 sm:grid-cols-2">
      <label className="booking-panel__field grid gap-1 font-medium">
        Room number
        <input
          name="room"
          className="booking-panel__input rounded border border-[#b8c9b6] px-3 py-2 font-normal transition focus:border-[#235c37] focus:outline-none focus:ring-2 focus:ring-[#235c37]/20"
          autoComplete="off"
        />
        {bookingState.status === "error" && bookingState.errors?.room ? (
          <BookingPanelErrorMessage message={bookingState.errors.room} />
        ) : null}
      </label>

      <label className="booking-panel__field grid gap-1 font-medium">
        Guest name
        <input
          name="guestName"
          className="booking-panel__input rounded border border-[#b8c9b6] px-3 py-2 font-normal transition focus:border-[#235c37] focus:outline-none focus:ring-2 focus:ring-[#235c37]/20"
          autoComplete="name"
        />
        {bookingState.status === "error" && bookingState.errors?.guestName ? (
          <BookingPanelErrorMessage message={bookingState.errors.guestName} />
        ) : null}
      </label>
    </div>

    {bookingState.status === "error" && bookingState.message ? (
      <BookingPanelErrorMessage message={bookingState.message} />
    ) : null}

    <button
      type="submit"
      className="booking-panel__action w-fit rounded border border-[#235c37] bg-[#235c37] px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-[#1d4d2f] focus:outline-none focus:ring-2 focus:ring-[#235c37] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      disabled={bookingState.status === "submitting"}
    >
      {bookingState.status === "submitting" ? "Booking..." : "Book cabana"}
    </button>
  </form>
);
