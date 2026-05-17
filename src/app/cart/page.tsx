"use client";

import Link from "next/link";
import { CartLineItem } from "@/components/CartLineItem";
import { EmptyState } from "@/components/EmptyState";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, isHydrated, updateQuantity, removeItem, clearCart } =
    useCart();

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-amber-100" />
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-amber-100" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-stone-900">Your cart</h1>
        <div className="mt-10">
          <EmptyState
            title="Your cart is empty"
            description="Browse our dry fruits and spices, then add items to your cart."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-900">Your cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-stone-500 transition hover:text-red-700"
        >
          Clear cart
        </button>
      </div>

      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <CartLineItem
            key={item.productId}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </ul>

      <div className="mt-8 rounded-2xl border border-amber-200/70 bg-white p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-stone-700">Subtotal</span>
          <span className="text-2xl font-bold text-stone-900">
            {formatPrice(subtotal)}
          </span>
        </div>
        <p className="mt-4 text-sm text-stone-500">
          Checkout and order history are planned for a future learning milestone.
          For now, your cart is saved in this browser via localStorage.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-amber-800 px-6 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
