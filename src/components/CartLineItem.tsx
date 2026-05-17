"use client";

import Image from "next/image";
import { QuantityStepper } from "@/components/QuantityStepper";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartLineItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartLineItemProps) {
  return (
    <li className="flex gap-4 rounded-2xl border border-amber-200/70 bg-white p-4">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-amber-50">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-stone-900">{item.name}</h3>
            <p className="text-sm text-stone-500">
              {formatPrice(item.price)} / {item.unit}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="text-sm text-stone-500 transition hover:text-red-700"
          >
            Remove
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => onUpdateQuantity(item.productId, q)}
          />
          <p className="font-semibold text-stone-900">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}
