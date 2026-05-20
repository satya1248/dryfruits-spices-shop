import {
  getPaymentMethodLabel,
  getPaymentStatusLabel,
} from "@/lib/orderLabels";
import { formatPrice } from "@/lib/utils";
import type { OrderDTO } from "@/types";
import { sendEmail } from "./email";
import { sendSms } from "./sms";

const STORE_NAME = "Bala Balaji Spices & Dryfruits";

function trackUrl(order: OrderDTO): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const params = new URLSearchParams({
    orderNumber: order.orderNumber,
    email: order.customer.email,
  });
  return `${base}/orders/track?${params.toString()}`;
}

function itemSummary(order: OrderDTO): string {
  return order.items
    .map((i) => `${i.name} x${i.quantity}`)
    .slice(0, 5)
    .join(", ");
}

export async function notifyOrderPlaced(order: OrderDTO): Promise<void> {
  const track = trackUrl(order);
  const paymentLine = `${getPaymentMethodLabel(order.paymentMethod)} — ${getPaymentStatusLabel(order.paymentMethod, order.paymentStatus)}`;
  const total = formatPrice(order.convertedTotal, order.currency);

  const subject = `Order confirmed ${order.orderNumber} — ${STORE_NAME}`;
  const text = [
    `Hi ${order.customer.name},`,
    ``,
    `Thank you for your order at ${STORE_NAME}.`,
    ``,
    `Order: ${order.orderNumber}`,
    `Total: ${total}`,
    `Payment: ${paymentLine}`,
    `Items: ${itemSummary(order)}`,
    ``,
    `Track your order: ${track}`,
    ``,
    `Delivery to:`,
    `${order.customer.addressLine1}`,
    `${order.customer.city}, ${order.customer.state} ${order.customer.postalCode}`,
  ].join("\n");

  const html = `
    <h2>Thank you for your order!</h2>
    <p>Hi ${order.customer.name},</p>
    <p>We have received your order at <strong>${STORE_NAME}</strong>.</p>
    <ul>
      <li><strong>Order:</strong> ${order.orderNumber}</li>
      <li><strong>Total:</strong> ${total}</li>
      <li><strong>Payment:</strong> ${paymentLine}</li>
      <li><strong>Items:</strong> ${itemSummary(order)}</li>
    </ul>
    <p><a href="${track}">Track your order</a></p>
    <p>We will notify you when your order is ready for delivery.</p>
  `;

  await Promise.allSettled([
    sendEmail({
      to: order.customer.email,
      subject,
      html,
      text,
    }),
    sendSms({
      to: order.customer.phone,
      body: `${STORE_NAME}: Order ${order.orderNumber} confirmed. Total ${total}. Track: ${track}`,
    }),
  ]);
}

export async function notifyReadyForDelivery(order: OrderDTO): Promise<void> {
  const track = trackUrl(order);
  const tracking = order.trackingNumber
    ? `Tracking: ${order.trackingNumber}`
    : "Your package is on the way";

  const subject = `Out for delivery ${order.orderNumber} — ${STORE_NAME}`;
  const text = [
    `Hi ${order.customer.name},`,
    ``,
    `Your order ${order.orderNumber} is ready for delivery and on the way.`,
    tracking,
    order.carrier ? `Carrier: ${order.carrier}` : "",
    ``,
    `Track: ${track}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <h2>Your order is on the way</h2>
    <p>Hi ${order.customer.name},</p>
    <p>Order <strong>${order.orderNumber}</strong> is <strong>out for delivery</strong>.</p>
    <p>${tracking}</p>
    ${order.carrier ? `<p>Carrier: ${order.carrier}</p>` : ""}
    <p><a href="${track}">Track delivery status</a></p>
  `;

  await Promise.allSettled([
    sendEmail({
      to: order.customer.email,
      subject,
      html,
      text,
    }),
    sendSms({
      to: order.customer.phone,
      body: `${STORE_NAME}: Order ${order.orderNumber} is out for delivery. ${tracking}. Track: ${track}`,
    }),
  ]);
}

export function dispatchOrderPlaced(order: OrderDTO): void {
  void notifyOrderPlaced(order).catch((err) => {
    console.error("notifyOrderPlaced failed:", err);
  });
}

export function dispatchReadyForDelivery(order: OrderDTO): void {
  void notifyReadyForDelivery(order).catch((err) => {
    console.error("notifyReadyForDelivery failed:", err);
  });
}
