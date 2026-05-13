export function MapErrorState({ message }: { message: string }) {
  return (
    <div className="rounded border border-[#d7aaa1] bg-[#fff7f4] p-5 text-[#6d2c21]">
      <h2 className="text-base font-semibold">Map unavailable</h2>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
}
