export default function AppLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-10 w-72 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>
        <div className="mt-8 h-80 animate-pulse rounded-2xl bg-white shadow-sm" />
      </section>
    </main>
  );
}