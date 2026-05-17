export default function RootLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="h-12 w-2/3 max-w-lg animate-pulse rounded-lg bg-amber-100" />
      <div className="mt-4 h-6 w-1/2 max-w-md animate-pulse rounded bg-amber-100" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-amber-100" />
        ))}
      </div>
    </div>
  );
}
