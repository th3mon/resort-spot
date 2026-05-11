export default function Home() {
  return (
    <div className="flex min-h-full flex-1 bg-[#f4f7f2] text-[#172018]">
      <main className="mx-auto flex w-full max-w-4xl flex-col justify-center gap-8 px-6 py-16 sm:px-10">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5e765d]">
            Resort Spot
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Interactive resort map and cabana booking app.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#4f5d50]">
            The project skeleton is ready. Upcoming roadmap steps will add map
            parsing, REST booking endpoints, and the guest-facing booking flow.
          </p>
        </section>
        <section className="grid gap-3 text-sm text-[#39463a] sm:grid-cols-3">
          <div className="rounded border border-[#d5ddcf] bg-white p-4">
            <p className="font-semibold text-[#172018]">Runtime inputs</p>
            <p className="mt-2">Accepted through --map and --bookings.</p>
          </div>
          <div className="rounded border border-[#d5ddcf] bg-white p-4">
            <p className="font-semibold text-[#172018]">API runtime</p>
            <p className="mt-2">Route Handlers are prepared for Node.js.</p>
          </div>
          <div className="rounded border border-[#d5ddcf] bg-white p-4">
            <p className="font-semibold text-[#172018]">Next step</p>
            <p className="mt-2">Implement ASCII map and booking data parsing.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
