const mapLoadingStyles = {
  minHeight: "calc(100svh - 138px)",
};

export function MapLoadingState() {
  return (
    <div
      style={mapLoadingStyles}
      className="map-loading grid min-h-svh place-items-center rounded border border-[#c9d5ca] bg-white text-sm font-medium text-[#54705d] shadow-sm"
    >
      <span className="map-loading__label ui-pulse-soft">Loading map</span>
    </div>
  );
}
