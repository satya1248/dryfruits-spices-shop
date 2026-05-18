export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="h-9 w-40 animate-pulse rounded-lg bg-amber-100" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="h-96 animate-pulse rounded-2xl bg-amber-100" />
        <div className="h-72 animate-pulse rounded-2xl bg-amber-100" />
      </div>
    </div>
  );
}
