import { BookingPanelErrorMessage } from "./booking-panel-error-message";
import type { BookingFormErrors } from "./booking-panel-types";

type BookingPanelFieldProps = {
  autoComplete: string;
  error: BookingFormErrors[keyof BookingFormErrors];
  label: string;
  name: keyof BookingFormErrors;
  shouldReserveMessageSpace: boolean;
};

export const BookingPanelField = ({
  autoComplete,
  error,
  label,
  name,
  shouldReserveMessageSpace,
}: BookingPanelFieldProps) => (
  <label className="booking-panel__field grid gap-1 font-medium">
    {label}
    <input
      name={name}
      className="booking-panel__input rounded border border-(--color-border-control) px-3 py-2 font-normal transition focus:border-(--color-action) focus:outline-none focus:ring-2 focus:ring-(--color-action-focus)"
      autoComplete={autoComplete}
    />
    <BookingPanelFieldMessage
      error={error}
      shouldReserveSpace={shouldReserveMessageSpace}
    />
  </label>
);

type BookingPanelFieldMessageProps = {
  error: BookingPanelFieldProps["error"];
  shouldReserveSpace: boolean;
};

const BookingPanelFieldMessage = ({
  error,
  shouldReserveSpace,
}: BookingPanelFieldMessageProps) => {
  if (error) {
    return (
      <div className="mt-2">
        <BookingPanelErrorMessage message={error} />
      </div>
    );
  }

  if (shouldReserveSpace) {
    return (
      <div
        className="booking-panel__message-placeholder mt-2 h-4 w-auto"
        aria-hidden="true"
      />
    );
  }

  return null;
};
