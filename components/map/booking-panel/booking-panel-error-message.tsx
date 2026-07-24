type BookingPanelErrorMessageProps = {
  message: string;
};

export const BookingPanelErrorMessage = ({
  message,
}: BookingPanelErrorMessageProps) => (
  <p
    className="booking-panel__message booking-panel__message--error text-xs font-medium text-[var(--color-danger-text)]"
    role="alert"
  >
    {message}
  </p>
);
