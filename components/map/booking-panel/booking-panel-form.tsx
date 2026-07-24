import { BookingPanelErrorMessage } from "./booking-panel-error-message";
import type { BookingState, BookingSubmitHandler } from "./booking-panel-types";

type BookingPanelFormProps = {
  selectedCabanaId: string;
  bookingState: BookingState;
  onCancel: () => void;
  onSubmit: BookingSubmitHandler;
};

export const BookingPanelForm = ({
  selectedCabanaId,
  bookingState,
  onCancel,
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
          className="booking-panel__input rounded border border-[var(--color-border-control)] px-3 py-2 font-normal transition focus:border-[var(--color-action)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action-focus)]"
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
          className="booking-panel__input rounded border border-[var(--color-border-control)] px-3 py-2 font-normal transition focus:border-[var(--color-action)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action-focus)]"
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

    <div className="booking-panel__actions flex flex-wrap gap-2">
      <button
        type="submit"
        className="booking-panel__action booking-panel__action--submit w-fit rounded border border-[var(--color-action)] bg-[var(--color-action)] px-4 py-2 font-semibold text-[var(--color-on-action)] shadow-sm transition hover:bg-[var(--color-action-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action)] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
        disabled={bookingState.status === "submitting"}
      >
        {bookingState.status === "submitting" ? "Booking..." : "Book cabana"}
      </button>

      <button
        type="button"
        className="booking-panel__action booking-panel__action--cancel w-fit rounded border border-[var(--color-border-control)] bg-[var(--color-surface-panel)] px-4 py-2 font-semibold text-[var(--color-text-body)] shadow-sm transition hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={bookingState.status === "submitting"}
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  </form>
);
