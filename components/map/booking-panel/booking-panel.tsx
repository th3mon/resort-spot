import { BookingPanelCloseButton } from "./booking-panel-close-button";
import { BookingPanelFeedback } from "./booking-panel-feedback";
import { BookingPanelForm } from "./booking-panel-form";
import type {
  BookingPanelFeedbackState,
  BookingState,
  BookingSubmitHandler,
} from "./booking-panel-types";

type BookingPanelProps = {
  selectedCabanaId: string | null;
  bookingState: BookingState;
  onClose: () => void;
  onSubmit: BookingSubmitHandler;
};

export function BookingPanel({
  selectedCabanaId,
  bookingState,
  onClose,
  onSubmit,
}: BookingPanelProps) {
  if (!selectedCabanaId && bookingState.status === "idle") {
    return null;
  }

  return (
    <section className="booking-panel relative mb-4 rounded border border-[#c9d5ca] bg-white p-4 pr-12 text-sm text-[#28382d] shadow-sm">
      <BookingPanelCloseButton onClose={onClose} />

      {selectedCabanaId ? (
        <BookingPanelForm
          selectedCabanaId={selectedCabanaId}
          bookingState={bookingState}
          onSubmit={onSubmit}
        />
      ) : null}

      {hasSuccessOrUnavailable(bookingState) ? (
        <BookingPanelFeedback bookingState={bookingState} />
      ) : null}
    </section>
  );
}

const hasSuccessOrUnavailable = (
  bookingState: BookingState,
): bookingState is BookingPanelFeedbackState =>
  bookingState.status === "success" || bookingState.status === "unavailable";
