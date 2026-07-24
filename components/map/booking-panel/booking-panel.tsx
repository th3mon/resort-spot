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
    <section className="booking-panel ui-enter sticky top-4 z-10 rounded border border-[var(--color-border-control)] bg-[var(--color-surface-panel)] p-4 text-sm text-[var(--color-text-body)] shadow-md shadow-[color:var(--color-shadow-soft)]">
      {selectedCabanaId ? (
        <BookingPanelForm
          selectedCabanaId={selectedCabanaId}
          bookingState={bookingState}
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      ) : null}

      {hasSuccessOrUnavailable(bookingState) ? (
        <BookingPanelFeedback bookingState={bookingState} />
      ) : null}

      <BookingPanelCloseButton
        disabled={bookingState.status === "submitting"}
        onClose={onClose}
      />
    </section>
  );
}

const hasSuccessOrUnavailable = (
  bookingState: BookingState,
): bookingState is BookingPanelFeedbackState =>
  bookingState.status === "success" || bookingState.status === "unavailable";
