"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/checkout", label: "Checkout" },
];

export function SiteHeader() {
  const { itemCount, isHydrated } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/80 bg-amber-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-amber-950">
          Spice<span className="text-amber-700">&</span>Dry
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-700 transition hover:text-amber-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="relative rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
          >
            Cart
            {isHydrated && itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
