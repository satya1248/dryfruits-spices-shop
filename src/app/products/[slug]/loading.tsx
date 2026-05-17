export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="h-5 w-32 animate-pulse rounded bg-amber-100" />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-amber-100" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-amber-100" />
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-amber-100" />
          <div className="h-8 w-32 animate-pulse rounded bg-amber-100" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-amber-100" />
          <div className="h-12 w-full animate-pulse rounded-full bg-amber-100" />
        </div>
      </div>
    </div>
  );
}
