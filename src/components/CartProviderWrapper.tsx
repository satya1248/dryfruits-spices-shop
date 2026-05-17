"use client";

import { CartProvider } from "@/context/CartContext";

export function CartProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
