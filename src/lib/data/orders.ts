import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import type { CartItem, CheckoutCustomer, OrderDTO, OrderItemDTO } from "@/types";

interface CreateOrderInput {
  customer: CheckoutCustomer;
  items: Pick<CartItem, "productId" | "quantity">[];
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

function toOrderDTO(doc: Record<string, unknown>): OrderDTO {
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
    })),
    subtotal: doc.subtotal as number,
    total: doc.total as number,
    status: doc.status as "placed" | "cancelled",
    createdAt: (doc.createdAt as Date).toISOString(),
  };
}

export async function createOrder(input: CreateOrderInput): Promise<OrderDTO> {
  await connectDB();

  const customer = validateCustomer(input.customer);
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
    };
  });

  const subtotal = Number(
    orderItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
  );

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
    })),
    subtotal,
    total: subtotal,
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
