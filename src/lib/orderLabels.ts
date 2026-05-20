import type { OrderDTO, PaymentMethod } from "@/types";

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case "cod":
      return "Cash on Delivery";
    case "razorpay":
      return "Online payment (Razorpay)";
    case "upi":
      return "Online payment (UPI)";
    default:
      return "Payment";
  }
}

export function getPaymentStatusLabel(
  method: PaymentMethod,
  status: OrderDTO["paymentStatus"],
): string {
  if (status === "paid") return "Paid";
  if (status === "failed") return "Failed";

  if (method === "cod") return "Pay on delivery";
  if (method === "upi") return "Complete UPI payment";
  if (method === "razorpay") return "Payment pending";
  return "Pending";
}

export type ShippingStatus =
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export const SHIPPING_STEPS: {
  status: ShippingStatus;
  label: string;
  description: string;
}[] = [
  { status: "processing", label: "Processing", description: "Order received and being prepared" },
  { status: "packed", label: "Packed", description: "Items packed and ready to ship" },
  { status: "shipped", label: "Shipped", description: "Handed to courier" },
  { status: "out_for_delivery", label: "Out for delivery", description: "Courier is on the way" },
  { status: "delivered", label: "Delivered", description: "Order delivered successfully" },
];

export function getShippingStatusLabel(status: ShippingStatus): string {
  return SHIPPING_STEPS.find((s) => s.status === status)?.label ?? status;
}

export function getShippingProgress(status: ShippingStatus): number {
  const index = SHIPPING_STEPS.findIndex((s) => s.status === status);
  if (index < 0) return 0;
  return Math.round(((index + 1) / SHIPPING_STEPS.length) * 100);
}
