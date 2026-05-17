export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice, getCategoryName, getCategorySlug } from "@/lib/utils";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let product: Awaited<ReturnType<typeof getProductBySlug>> = null;

  try {
    product = await getProductBySlug(slug);
  } catch {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-red-900">Database connection error</h1>
          <p className="mt-2 text-red-700">Check your MONGODB_URI and run npm run seed.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const categorySlug = getCategorySlug(product.category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/products"
        className="text-sm font-medium text-amber-800 hover:text-amber-900"
      >
        ← Back to products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-amber-200/70 bg-amber-50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-amber-800">
            {categorySlug ? (
              <Link href={`/products?category=${categorySlug}`}>
                {getCategoryName(product.category)}
              </Link>
            ) : (
              getCategoryName(product.category)
            )}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {formatPrice(product.price)}
            <span className="ml-2 text-base font-normal text-stone-500">
              per {product.unit}
            </span>
          </p>

          {!product.inStock && (
            <p className="mt-2 text-sm font-medium text-red-700">Currently out of stock</p>
          )}

          <p className="mt-6 leading-relaxed text-stone-600">{product.description}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
