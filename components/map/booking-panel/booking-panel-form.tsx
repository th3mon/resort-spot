import { BookingPanelErrorMessage } from "./booking-panel-error-message";
import { BookingPanelField } from "./booking-panel-field";
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
}: BookingPanelFormProps) => {
  const fieldErrors = errorsFor(bookingState);
  const shouldReserveFieldMessageSpace =
    shouldReserveMessageSpaceFor(bookingState);

  return (
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
        <BookingPanelField
          label="Room number"
          name="room"
          autoComplete="off"
          error={fieldErrors?.room}
          shouldReserveMessageSpace={shouldReserveFieldMessageSpace}
        />

        <BookingPanelField
          label="Guest name"
          name="guestName"
          autoComplete="name"
          error={fieldErrors?.guestName}
          shouldReserveMessageSpace={shouldReserveFieldMessageSpace}
        />

        <BookingPanelFormMessage bookingState={bookingState} />
      </div>

      <div className="booking-panel__actions flex flex-wrap gap-3">
        <button
          type="submit"
          className="booking-panel__action booking-panel__action--submit w-fit rounded border border-(--color-action) bg-(--color-action) px-4 py-2 font-semibold text-(--color-on-action) shadow-sm transition hover:bg-(--color-action-hover) focus:outline-none focus:ring-2 focus:ring-(--color-action) focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
          disabled={bookingState.status === "submitting"}
        >
          {bookingState.status === "submitting" ? "Booking..." : "Book cabana"}
        </button>

        <button
          type="button"
          className="booking-panel__action booking-panel__action--cancel w-fit rounded border border-(--color-border-control) bg-(--color-surface-panel) px-4 py-2 font-semibold text-(--color-text-body) shadow-sm transition hover:border-(--color-text-muted) hover:bg-(--color-surface-muted) focus:outline-none focus:ring-2 focus:ring-(--color-action) focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={bookingState.status === "submitting"}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const errorsFor = (bookingState: BookingState) =>
  bookingState.status === "error" ? bookingState.errors : null;

const shouldReserveMessageSpaceFor = (bookingState: BookingState) =>
  bookingState.status === "error" && !bookingState.message;

type BookingPanelFormMessageProps = {
  bookingState: BookingState;
};

const BookingPanelFormMessage = ({
  bookingState,
}: BookingPanelFormMessageProps) => {
  if (bookingState.status === "error" && bookingState.message) {
    return (
      <div className="booking-panel__form-message md:col-span-2">
        <BookingPanelErrorMessage message={bookingState.message} />
      </div>
    );
  }

  if (bookingState.status === "submitting" || bookingState.status === "idle") {
    return (
      <div
        className="booking-panel__message-placeholder h-4 w-auto"
        aria-hidden="true"
      />
    );
  }

  return null;
};
