type MapErrorStateProps = {
  message: string;
};

export function MapErrorState({ message }: MapErrorStateProps) {
  return (
    <div className="map-error ui-enter rounded border border-[#d7aaa1] bg-[#fff7f4] p-5 text-[#6d2c21] shadow-sm">
      <h2 className="map-error__title text-base font-semibold">
        Map unavailable
      </h2>
      <p className="map-error__message mt-2 text-sm">{message}</p>
    </div>
  );
}
