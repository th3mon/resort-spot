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
    className="booking-panel__close absolute -right-1 -top-1 grid size-7 place-items-center rounded border border-(--color-border-control) bg-(--color-surface-panel) text-xs font-semibold text-(--color-text-body) shadow-sm transition hover:border-(--color-text-muted) hover:bg-(--color-surface-muted) focus:outline-none focus:ring-2 focus:ring-(--color-action) focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    aria-label="Close booking panel"
    disabled={disabled}
    onClick={onClose}
  >
    X
  </button>
);
