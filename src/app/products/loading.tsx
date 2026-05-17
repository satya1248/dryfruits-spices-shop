export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-amber-100" />
      <div className="mt-2 h-5 w-32 animate-pulse rounded bg-amber-100" />
      <div className="mt-8 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-amber-100" />
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-[4/3] animate-pulse rounded-2xl bg-amber-100"
          />
        ))}
      </div>
    </div>
  );
}
