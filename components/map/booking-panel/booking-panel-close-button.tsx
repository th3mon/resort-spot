type BookingPanelCloseButtonProps = {
  disabled: boolean;
  onClose: () => void;
};

export const BookingPanelCloseButton = ({
  disabled,
  onClose,
}: BookingPanelCloseButtonProps) => (
  <button
    type="button"
    className="booking-panel__close absolute -right-1 -top-1 shadow-sm grid size-7 place-items-center rounded border border-[#b8c9b6] bg-white text-xs font-semibold text-[#28382d] transition hover:border-[#54705d] hover:bg-[#f4f7f2] focus:outline-none focus:ring-2 focus:ring-[#235c37] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    aria-label="Close booking panel"
    disabled={disabled}
    onClick={onClose}
  >
    X
  </button>
);
