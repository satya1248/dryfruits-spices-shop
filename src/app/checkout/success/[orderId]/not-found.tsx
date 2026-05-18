import { EmptyState } from "@/components/EmptyState";

export default function OrderNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <EmptyState
        title="Order not found"
        description="This order confirmation link is invalid or the order was removed."
        actionLabel="Browse products"
        actionHref="/products"
      />
    </div>
  );
}
