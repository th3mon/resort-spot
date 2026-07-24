import type { BookingPanelFeedbackState } from "./booking-panel-types";

type BookingPanelFeedbackProps = {
  bookingState: BookingPanelFeedbackState;
};

export const BookingPanelFeedback = ({
  bookingState,
}: BookingPanelFeedbackProps) => (
  <p
    className={
      bookingState.status === "success"
        ? "booking-panel__message booking-panel__message--success ui-enter rounded border border-[var(--color-success-border)] bg-[var(--color-success-surface)] p-3 font-medium text-[var(--color-action)]"
        : "booking-panel__message booking-panel__message--unavailable ui-enter rounded border border-[var(--color-danger-border)] bg-[var(--color-danger-surface)] p-3 font-medium text-[var(--color-danger-text)]"
    }
    role={bookingState.status === "unavailable" ? "alert" : "status"}
  >
    {bookingState.message}
  </p>
);
