"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { QuantityStepper } from "@/components/QuantityStepper";
import type { ProductDTO } from "@/types";

interface AddToCartButtonProps {
  product: ProductDTO;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        unit: product.unit,
        imageUrl: product.imageUrl,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!product.inStock) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-full bg-stone-300 px-6 py-3 text-sm font-medium text-stone-600"
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <QuantityStepper value={quantity} onChange={setQuantity} />
      <button
        type="button"
        onClick={handleAdd}
        className="flex-1 rounded-full bg-amber-800 px-6 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
