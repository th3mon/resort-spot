type BookingPanelCloseButtonProps = {
  onClose: () => void;
};

export const BookingPanelCloseButton = ({
  onClose,
}: BookingPanelCloseButtonProps) => (
  <button
    type="button"
    className="booking-panel__close absolute right-3 top-3 grid size-7 place-items-center rounded border border-[#b8c9b6] text-xs font-semibold text-[#28382d] hover:bg-[#f4f7f2]"
    aria-label="Close booking panel"
    onClick={onClose}
  >
    X
  </button>
);
