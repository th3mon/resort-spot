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
        ? "booking-panel__message booking-panel__message--success ui-enter rounded border border-(--color-success-border) bg-(--color-success-surface) p-3 font-medium text-(--color-action)"
        : "booking-panel__message booking-panel__message--unavailable ui-enter rounded border border-(--color-danger-border) bg-(--color-danger-surface) p-3 font-medium text-(--color-danger-text)"
    }
    role={bookingState.status === "unavailable" ? "alert" : "status"}
  >
    {bookingState.message}
  </p>
);
