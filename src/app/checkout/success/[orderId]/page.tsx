export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ShippingTimeline } from "@/components/ShippingTimeline";
import { getOrderById } from "@/lib/data/orders";
import {
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getShippingStatusLabel,
} from "@/lib/orderLabels";
import { formatPrice } from "@/lib/utils";

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;

  let order: Awaited<ReturnType<typeof getOrderById>> = null;

  try {
    order = await getOrderById(orderId);
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-red-900">
            Could not load order
          </h1>
          <p className="mt-2 text-red-700">
            Check your MongoDB connection and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  const trackHref = `/orders/track?orderNumber=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.customer.email)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-amber-200/70 bg-white p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-amber-800">
          Order confirmed
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">
          Thank you, {order.customer.name}
        </h1>
        <p className="mt-3 text-stone-600">
          Your order has been placed. Track delivery status anytime using your
          order number and email.
        </p>

        <div className="mt-6 rounded-xl bg-amber-50 p-4">
          <p className="text-sm text-stone-600">Order number</p>
          <p className="text-lg font-semibold text-stone-900">{order.orderNumber}</p>
          <p className="mt-2 text-sm text-stone-600">
            Payment:{" "}
            <span className="font-medium text-stone-900">
              {getPaymentMethodLabel(order.paymentMethod)}
            </span>
            {" · "}
            <span
              className={
                order.paymentStatus === "paid"
                  ? "font-medium text-green-800"
                  : "font-medium text-amber-900"
              }
            >
              {getPaymentStatusLabel(order.paymentMethod, order.paymentStatus)}
            </span>
          </p>
          <p className="mt-1 text-sm text-stone-600">
            Shipping:{" "}
            <span className="font-medium text-stone-900">
              {getShippingStatusLabel(order.shippingStatus)}
            </span>
          </p>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-900">Delivery tracking</h2>
          <div className="mt-4">
            <ShippingTimeline
              currentStatus={order.shippingStatus}
              updates={order.shippingUpdates}
              trackingNumber={order.trackingNumber}
              carrier={order.carrier}
            />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-stone-900">Items</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between gap-4 border-b border-amber-100 pb-3 text-sm last:border-0"
              >
                <div>
                  <p className="font-medium text-stone-900">{item.name}</p>
                  <p className="text-stone-500">
                    {item.quantity} x{" "}
                    {formatPrice(item.convertedPrice, order.currency)} / {item.unit}
                  </p>
                </div>
                <p className="font-semibold text-stone-900">
                  {formatPrice(item.convertedLineTotal, order.currency)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-lg font-semibold text-stone-900">
            <span>Total</span>
            <span>{formatPrice(order.convertedTotal, order.currency)}</span>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-amber-200 p-4">
          <h2 className="font-semibold text-stone-900">Delivery details</h2>
          <p className="mt-2 text-sm text-stone-600">
            {order.customer.addressLine1}
            {order.customer.addressLine2 ? `, ${order.customer.addressLine2}` : ""}
            <br />
            {order.customer.city}, {order.customer.state} {order.customer.postalCode}
            <br />
            {order.customer.country}
          </p>
          <p className="mt-3 text-sm text-stone-500">
            {order.customer.email} · {order.customer.phone}
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={trackHref}
            className="rounded-full bg-amber-800 px-6 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
          >
            Track this order
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-amber-300 bg-white px-6 py-2.5 text-sm font-medium text-stone-800 transition hover:border-amber-500"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
