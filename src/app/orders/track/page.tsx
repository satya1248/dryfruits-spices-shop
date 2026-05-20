"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShippingTimeline } from "@/components/ShippingTimeline";
import {
  getPaymentMethodLabel,
  getPaymentStatusLabel,
} from "@/lib/orderLabels";
import { formatPrice } from "@/lib/utils";
import type { OrderDTO } from "@/types";

function TrackOrderForm() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("orderNumber") ?? "",
  );
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrack(e: FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const params = new URLSearchParams({ orderNumber, email });
      const resp = await fetch(`/api/orders/track?${params.toString()}`);
      const json = (await resp.json()) as { data?: OrderDTO; error?: string };

      if (!resp.ok || !json.data) {
        throw new Error(json.error ?? "Order not found");
      }

      setOrder(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not track order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-stone-900">Track your order</h1>
      <p className="mt-2 text-stone-600">
        Enter your order number and email to see shipping and payment status.
      </p>

      <form
        onSubmit={handleTrack}
        className="mt-8 rounded-2xl border border-amber-200/70 bg-white p-6"
      >
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Order number</span>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. DF-..."
            required
            className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-stone-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-amber-800 px-6 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-900 disabled:opacity-60"
        >
          {loading ? "Looking up order..." : "Track order"}
        </button>
      </form>

      {order && (
        <div className="mt-8 rounded-2xl border border-amber-200/70 bg-white p-6">
          <p className="text-sm text-stone-600">Order</p>
          <p className="text-lg font-semibold text-stone-900">{order.orderNumber}</p>
          <p className="mt-2 text-sm text-stone-600">
            {getPaymentMethodLabel(order.paymentMethod)} ·{" "}
            {getPaymentStatusLabel(order.paymentMethod, order.paymentStatus)}
          </p>
          <p className="mt-1 text-sm font-medium text-stone-900">
            Total: {formatPrice(order.convertedTotal, order.currency)}
          </p>

          <div className="mt-6">
            <ShippingTimeline
              currentStatus={order.shippingStatus}
              updates={order.shippingUpdates}
              trackingNumber={order.trackingNumber}
              carrier={order.carrier}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-amber-100" />
        </div>
      }
    >
      <TrackOrderForm />
    </Suspense>
  );
}
