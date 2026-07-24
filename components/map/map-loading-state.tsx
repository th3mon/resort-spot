const mapLoadingStyles = {
  minHeight: "calc(100svh - 138px)",
};

export function MapLoadingState() {
  return (
    <div
      style={mapLoadingStyles}
      className="map-loading grid min-h-svh place-items-center rounded border border-[var(--color-border-muted)] bg-[var(--color-surface-panel)] text-sm font-medium text-[var(--color-text-muted)] shadow-sm"
    >
      <span className="map-loading__label ui-pulse-soft">Loading map</span>
    </div>
  );
}
