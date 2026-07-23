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
        ? "booking-panel__message booking-panel__message--success text-[#235c37]"
        : "booking-panel__message booking-panel__message--unavailable text-[#6d2c21]"
    }
    role={bookingState.status === "unavailable" ? "alert" : "status"}
  >
    {bookingState.message}
  </p>
);
