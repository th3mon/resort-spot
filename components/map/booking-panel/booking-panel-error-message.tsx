type BookingPanelErrorMessageProps = {
  message: string;
};

export const BookingPanelErrorMessage = ({
  message,
}: BookingPanelErrorMessageProps) => (
  <p
    className="booking-panel__message booking-panel__message--error text-[#6d2c21]"
    role="alert"
  >
    {message}
  </p>
);
