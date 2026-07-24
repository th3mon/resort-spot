type MapErrorStateProps = {
  message: string;
};

export function MapErrorState({ message }: MapErrorStateProps) {
  return (
    <div className="map-error ui-enter rounded border border-[var(--color-danger-border)] bg-[var(--color-danger-surface)] p-5 text-[var(--color-danger-text)] shadow-sm">
      <h2 className="map-error__title text-base font-semibold">
        Map unavailable
      </h2>
      <p className="map-error__message mt-2 text-sm">{message}</p>
    </div>
  );
}
