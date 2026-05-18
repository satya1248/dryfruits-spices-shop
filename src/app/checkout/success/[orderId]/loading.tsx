export default function OrderSuccessLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-amber-200/70 bg-white p-8">
        <div className="h-4 w-24 animate-pulse rounded bg-amber-100" />
        <div className="mt-3 h-10 w-2/3 animate-pulse rounded-lg bg-amber-100" />
        <div className="mt-4 h-16 animate-pulse rounded-lg bg-amber-100" />
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded bg-amber-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
