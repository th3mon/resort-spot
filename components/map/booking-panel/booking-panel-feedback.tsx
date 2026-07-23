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
        ? "booking-panel__message booking-panel__message--success ui-enter rounded border border-[#b7d5bd] bg-[#edf8ee] p-3 font-medium text-[#235c37]"
        : "booking-panel__message booking-panel__message--unavailable ui-enter rounded border border-[#d7aaa1] bg-[#fff7f4] p-3 font-medium text-[#6d2c21]"
    }
    role={bookingState.status === "unavailable" ? "alert" : "status"}
  >
    {bookingState.message}
  </p>
);
