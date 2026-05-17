export const dynamic = "force-dynamic";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getCategories } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let featured: Awaited<ReturnType<typeof getProducts>> = [];

  try {
    [categories, featured] = await Promise.all([
      getCategories(),
      getProducts({ featured: true }),
    ]);
  } catch {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-red-900">
            Unable to connect to the database
          </h1>
          <p className="mt-2 text-red-700">
            Add your <code className="rounded bg-red-100 px-1">MONGODB_URI</code> to{" "}
            <code className="rounded bg-red-100 px-1">.env.local</code> and run{" "}
            <code className="rounded bg-red-100 px-1">npm run seed</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="border-b border-amber-200/80 bg-gradient-to-b from-amber-100/50 to-[#fdf8f3]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-800">
            Premium pantry essentials
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Dry fruits & spices, sourced with care
          </h1>
          <p className="mt-4 max-w-xl text-lg text-stone-600">
            Explore our learning storefront for nuts, dried fruit, and aromatic
            spices. Add items to your cart and practice building with Next.js
            and MongoDB.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-amber-800 px-6 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
            >
              Shop all products
            </Link>
            <Link
              href="/products?featured=true"
              className="rounded-full border border-amber-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 transition hover:border-amber-500"
            >
              View featured
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-stone-900">Shop by category</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat.slug}`}
              className="rounded-2xl border border-amber-200/70 bg-white p-6 transition hover:border-amber-400"
            >
              <h3 className="text-xl font-semibold text-stone-900">{cat.name}</h3>
              {cat.description && (
                <p className="mt-2 text-stone-600">{cat.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-stone-900">Featured products</h2>
          <Link
            href="/products?featured=true"
            className="text-sm font-medium text-amber-800 hover:text-amber-900"
          >
            See all
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="mt-6 text-stone-600">No featured products yet. Run the seed script.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
