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
    className="booking-panel__close absolute right-3 top-3 grid size-7 place-items-center rounded border border-[#b8c9b6] text-xs font-semibold text-[#28382d] hover:bg-[#f4f7f2] disabled:cursor-not-allowed disabled:opacity-50"
    aria-label="Close booking panel"
    disabled={disabled}
    onClick={onClose}
  >
    X
  </button>
);
