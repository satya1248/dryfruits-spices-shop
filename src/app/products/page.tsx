export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { ProductSearch } from "@/components/ProductSearch";
import { getCategories } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    featured?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;
  const featured =
    params.featured === "true" ? true : params.featured === "false" ? false : undefined;

  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let error = false;

  try {
    [categories, products] = await Promise.all([
      getCategories(),
      getProducts({ category, search, featured }),
    ]);
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-red-900">Database connection error</h1>
          <p className="mt-2 text-red-700">
            Check your MONGODB_URI in .env.local and run npm run seed.
          </p>
        </div>
      </div>
    );
  }

  const title =
    featured === true
      ? "Featured products"
      : category
        ? categories.find((c) => c.slug === category)?.name ?? "Products"
        : search
          ? `Results for "${search}"`
          : "All products";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">{title}</h1>
          <p className="mt-1 text-stone-600">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Suspense fallback={<div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-amber-100" />}>
          <ProductSearch />
        </Suspense>
      </div>

      <div className="mt-8">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-amber-100" />}>
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No products found"
            description="Try a different category or search term, or seed the database with sample data."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
