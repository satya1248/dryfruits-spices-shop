"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CategoryDTO } from "@/types";

interface CategoryFilterProps {
  categories: CategoryDTO[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";
  const search = searchParams.get("search") ?? "";

  function buildHref(categorySlug: string) {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (search) params.set("search", search);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildHref("")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          !active
            ? "bg-amber-800 text-amber-50"
            : "border border-amber-200 bg-white text-stone-700 hover:border-amber-400"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat._id}
          href={buildHref(cat.slug)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            active === cat.slug
              ? "bg-amber-800 text-amber-50"
              : "border border-amber-200 bg-white text-stone-700 hover:border-amber-400"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
