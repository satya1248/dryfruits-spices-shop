export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data/orders";
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-amber-200/70 bg-white p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-amber-800">
          Order placed
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">
          Thank you, {order.customer.name}
        </h1>
        <p className="mt-3 text-stone-600">
          Your mock order was saved in MongoDB. Use this page to understand the
          order data flow before adding real payments later.
        </p>

        <div className="mt-6 rounded-xl bg-amber-50 p-4">
          <p className="text-sm text-stone-600">Order number</p>
          <p className="text-lg font-semibold text-stone-900">{order.orderNumber}</p>
        </div>

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
                    {item.quantity} x {formatPrice(item.price)} / {item.unit}
                  </p>
                </div>
                <p className="font-semibold text-stone-900">
                  {formatPrice(item.lineTotal)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-lg font-semibold text-stone-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
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
            href="/products"
            className="rounded-full bg-amber-800 px-6 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="rounded-full border border-amber-300 bg-white px-6 py-2.5 text-sm font-medium text-stone-800 transition hover:border-amber-500"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
