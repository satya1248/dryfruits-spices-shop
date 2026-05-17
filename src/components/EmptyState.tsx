import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel = "Browse products",
  actionHref = "/products",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200/60 bg-white px-8 py-16 text-center">
      <h2 className="text-xl font-semibold text-stone-800">{title}</h2>
      <p className="mt-2 max-w-sm text-stone-600">{description}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="mt-6 rounded-full bg-amber-800 px-6 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
