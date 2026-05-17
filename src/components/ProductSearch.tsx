"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 sm:max-w-md">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="flex-1 rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
      />
      <button
        type="submit"
        className="rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
      >
        Search
      </button>
    </form>
  );
}
