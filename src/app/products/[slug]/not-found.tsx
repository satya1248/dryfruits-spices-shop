import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <EmptyState
        title="Product not found"
        description="This product may have been removed or the link is incorrect."
        actionLabel="Browse all products"
        actionHref="/products"
      />
      <p className="mt-4 text-center">
        <Link href="/" className="text-sm text-amber-800 hover:text-amber-900">
          Return home
        </Link>
      </p>
    </div>
  );
}
