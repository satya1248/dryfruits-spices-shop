"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { useCart } from "@/context/CartContext";
import {
  convertFromInr,
  formatPrice,
  getDefaultCurrencyForCountry,
  SUPPORTED_CURRENCIES,
} from "@/lib/utils";
import type { CheckoutCustomer, CurrencyCode, OrderDTO, PaymentMethod } from "@/types";

const initialCustomer: CheckoutCustomer = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

interface OrderResponse {
  data?: OrderDTO;
  error?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const [customer, setCustomer] = useState(initialCustomer);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof CheckoutCustomer, value: string) {
    setCustomer((prev) => ({ ...prev, [field]: value }));

    if (field === "country") {
      setCurrency(getDefaultCurrencyForCountry(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          currency,
          paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const result = (await response.json()) as OrderResponse;

      if (!response.ok || !result.data) {
        throw new Error(result.error ?? "Could not place order.");
      }

      clearCart();
      router.push(`/checkout/success/${result.data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const convertedSubtotal = convertFromInr(subtotal, currency);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="h-9 w-40 animate-pulse rounded-lg bg-amber-100" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="h-96 animate-pulse rounded-2xl bg-amber-100" />
          <div className="h-72 animate-pulse rounded-2xl bg-amber-100" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Your cart is empty"
          description="Add products before starting checkout."
          actionLabel="Browse products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/cart"
        className="text-sm font-medium text-amber-800 hover:text-amber-900"
      >
        Back to cart
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-stone-900">Mock checkout</h1>
        <p className="max-w-2xl text-stone-600">
          Enter delivery details and choose an India-friendly mock payment
          method. No real payment is collected in this learning version.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-2xl border border-amber-200/70 bg-white p-6">
          <h2 className="text-xl font-semibold text-stone-900">Delivery details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-stone-700">Full name</span>
              <input
                required
                value={customer.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">Email</span>
              <input
                required
                type="email"
                value={customer.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">Phone</span>
              <input
                required
                value={customer.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-stone-700">Address line 1</span>
              <input
                required
                value={customer.addressLine1}
                onChange={(event) => updateField("addressLine1", event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-stone-700">Address line 2</span>
              <input
                value={customer.addressLine2 ?? ""}
                onChange={(event) => updateField("addressLine2", event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">City</span>
              <input
                required
                value={customer.city}
                onChange={(event) => updateField("city", event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">State</span>
              <input
                required
                value={customer.state}
                onChange={(event) => updateField("state", event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">Postal code</span>
              <input
                required
                value={customer.postalCode}
                onChange={(event) => updateField("postalCode", event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">Country</span>
              <input
                required
                value={customer.country}
                onChange={(event) => updateField("country", event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-amber-200/70 bg-white p-6">
          <h2 className="text-xl font-semibold text-stone-900">Order summary</h2>
          <div className="mt-4 grid gap-4">
            <label>
              <span className="text-sm font-medium text-stone-700">Display currency</span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                {SUPPORTED_CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} - {item.label}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs text-stone-500">
                Defaults from delivery country; rates are fixed for this learning project.
              </span>
            </label>

            <fieldset>
              <legend className="text-sm font-medium text-stone-700">
                Payment method
              </legend>
              <div className="mt-2 grid gap-2">
                <label className="flex cursor-pointer gap-3 rounded-lg border border-amber-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-medium text-stone-900">
                      Cash on Delivery
                    </span>
                    <span className="text-stone-500">
                      Collect payment when the order is delivered.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer gap-3 rounded-lg border border-amber-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-medium text-stone-900">
                      UPI placeholder
                    </span>
                    <span className="text-stone-500">
                      Marks the order as pending UPI payment. Gateway integration comes later.
                    </span>
                  </span>
                </label>
              </div>
            </fieldset>
          </div>

          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-stone-800">{item.name}</p>
                  <p className="text-stone-500">
                    {item.quantity} x {formatPrice(convertFromInr(item.price, currency), currency)}
                  </p>
                </div>
                <p className="font-medium text-stone-900">
                  {formatPrice(
                    convertFromInr(item.price * item.quantity, currency),
                    currency,
                  )}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-amber-200 pt-4">
            <div className="flex justify-between text-lg font-semibold text-stone-900">
              <span>Total</span>
              <span>{formatPrice(convertedSubtotal, currency)}</span>
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Product prices are stored in INR and converted for display at checkout.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full bg-amber-800 px-6 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Placing order..." : "Place mock order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
