const mapLoadingStyles = {
  minHeight: "calc(100svh - 138px)",
};

export function MapLoadingState() {
  return (
    <div
      style={mapLoadingStyles}
      className="map-loading grid min-h-svh place-items-center rounded border border-(--color-border-muted) bg-(--color-surface-panel) text-sm font-medium text-(--color-text-muted) shadow-sm"
    >
      <span className="map-loading__label ui-pulse-soft">Loading map</span>
    </div>
  );
}
