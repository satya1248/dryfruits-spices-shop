import Image from "next/image";
import Link from "next/link";
import { formatPrice, getCategoryName } from "@/lib/utils";
import type { ProductDTO } from "@/types";

interface ProductCardProps {
  product: ProductDTO;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-amber-200/70 bg-white transition hover:border-amber-400"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-amber-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-800 px-2.5 py-0.5 text-xs font-medium text-amber-50">
            Featured
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-stone-700 px-2.5 py-0.5 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-800">
          {getCategoryName(product.category)}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-stone-900 group-hover:text-amber-900">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-stone-600">
          {product.description}
        </p>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-lg font-semibold text-stone-900">
            {formatPrice(product.price)}
            <span className="ml-1 text-sm font-normal text-stone-500">
              / {product.unit}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
