import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import {
  convertFromInr,
  getExchangeRate,
  isCurrencyCode,
} from "@/lib/utils";
import type {
  CartItem,
  CheckoutCustomer,
  CurrencyCode,
  OrderDTO,
  OrderItemDTO,
  PaymentMethod,
} from "@/types";

interface CreateOrderInput {
  customer: CheckoutCustomer;
  items: Pick<CartItem, "productId" | "quantity">[];
  currency?: string;
  paymentMethod?: string;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validateCustomer(customer: CheckoutCustomer): CheckoutCustomer {
  const cleaned = {
    name: clean(customer.name),
    email: clean(customer.email).toLowerCase(),
    phone: clean(customer.phone),
    addressLine1: clean(customer.addressLine1),
    addressLine2: clean(customer.addressLine2),
    city: clean(customer.city),
    state: clean(customer.state),
    postalCode: clean(customer.postalCode),
    country: clean(customer.country) || "India",
  };

  const required = [
    cleaned.name,
    cleaned.email,
    cleaned.phone,
    cleaned.addressLine1,
    cleaned.city,
    cleaned.state,
    cleaned.postalCode,
    cleaned.country,
  ];

  if (required.some((value) => value.length === 0)) {
    throw new Error("Please fill all required checkout fields.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
    throw new Error("Please enter a valid email address.");
  }

  return cleaned;
}

function makeOrderNumber(): string {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DF-${Date.now().toString(36).toUpperCase()}-${suffix}`;
}

function normalizeCurrency(currency: string | undefined): CurrencyCode {
  return currency && isCurrencyCode(currency) ? currency : "INR";
}

function normalizePaymentMethod(method: string | undefined): PaymentMethod {
  if (method === "upi") return "upi";
  if (method === "razorpay") return "razorpay";
  return "cod";
}

function toOrderDTO(doc: Record<string, unknown>): OrderDTO {
  const currency = normalizeCurrency(doc.currency as string | undefined);
  const exchangeRate = (doc.exchangeRate as number | undefined) ?? getExchangeRate(currency);
  const subtotal = doc.subtotal as number;
  const total = doc.total as number;

  return {
    _id: (doc._id as { toString(): string }).toString(),
    orderNumber: doc.orderNumber as string,
    customer: doc.customer as CheckoutCustomer,
    items: (doc.items as Record<string, unknown>[]).map((item) => ({
      productId: (item.product as { toString(): string }).toString(),
      slug: item.slug as string,
      name: item.name as string,
      price: item.price as number,
      unit: item.unit as string,
      quantity: item.quantity as number,
      imageUrl: item.imageUrl as string,
      lineTotal: item.lineTotal as number,
      convertedPrice:
        (item.convertedPrice as number | undefined) ??
        convertFromInr(item.price as number, currency),
      convertedLineTotal:
        (item.convertedLineTotal as number | undefined) ??
        convertFromInr(item.lineTotal as number, currency),
    })),
    subtotal,
    total,
    currency,
    exchangeRate,
    convertedSubtotal:
      (doc.convertedSubtotal as number | undefined) ?? convertFromInr(subtotal, currency),
    convertedTotal:
      (doc.convertedTotal as number | undefined) ?? convertFromInr(total, currency),
    paymentMethod: normalizePaymentMethod(doc.paymentMethod as string | undefined),
    paymentStatus:
      (doc.paymentStatus as "pending" | "paid" | "failed" | undefined) ?? "pending",
    paymentProvider: doc.paymentProvider as "razorpay" | undefined,
    razorpayOrderId: doc.razorpayOrderId as string | undefined,
    razorpayPaymentId: doc.razorpayPaymentId as string | undefined,
    status: doc.status as "placed" | "cancelled",
    createdAt: (doc.createdAt as Date).toISOString(),
  };
}

export async function createOrder(input: CreateOrderInput): Promise<OrderDTO> {
  await connectDB();

  const customer = validateCustomer(input.customer);
  const currency = normalizeCurrency(input.currency);
  const exchangeRate = getExchangeRate(currency);
  const paymentMethod = normalizePaymentMethod(input.paymentMethod);
  const requestedItems = input.items
    .map((item) => ({
      productId: clean(item.productId),
      quantity: Number(item.quantity),
    }))
    .filter((item) => item.productId && Number.isInteger(item.quantity) && item.quantity > 0);

  if (requestedItems.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const productIds = requestedItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const orderItems: OrderItemDTO[] = requestedItems.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error("One or more products are no longer available.");
    }

    if (!product.inStock) {
      throw new Error(`${product.name} is currently out of stock.`);
    }

    const lineTotal = Number((product.price * item.quantity).toFixed(2));

    return {
      productId: product._id.toString(),
      slug: product.slug,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: item.quantity,
      imageUrl: product.imageUrl,
      lineTotal,
      convertedPrice: convertFromInr(product.price, currency),
      convertedLineTotal: convertFromInr(lineTotal, currency),
    };
  });

  const subtotal = Number(
    orderItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
  );
  const convertedSubtotal = convertFromInr(subtotal, currency);

  const order = await Order.create({
    orderNumber: makeOrderNumber(),
    customer,
    items: orderItems.map((item) => ({
      product: new Types.ObjectId(item.productId),
      slug: item.slug,
      name: item.name,
      price: item.price,
      unit: item.unit,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      lineTotal: item.lineTotal,
      convertedPrice: item.convertedPrice,
      convertedLineTotal: item.convertedLineTotal,
    })),
    subtotal,
    total: subtotal,
    currency,
    exchangeRate,
    convertedSubtotal,
    convertedTotal: convertedSubtotal,
    paymentMethod,
    paymentStatus: "pending",
    paymentProvider: paymentMethod === "razorpay" ? "razorpay" : undefined,
    status: "placed",
  });

  return toOrderDTO(order.toObject() as Record<string, unknown>);
}

export async function getOrderById(id: string): Promise<OrderDTO | null> {
  await connectDB();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const order = await Order.findById(id).lean();
  if (!order) return null;

  return toOrderDTO(order as Record<string, unknown>);
}
