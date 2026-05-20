export interface CategoryDTO {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductDTO {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  category: CategoryDTO | string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  tags?: string[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  imageUrl: string;
}

export interface ProductFilters {
  category?: string;
  featured?: boolean;
  search?: string;
}

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD";

export type PaymentMethod = "cod" | "upi" | "razorpay";

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItemDTO {
  productId: string;
  slug: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  imageUrl: string;
  lineTotal: number;
  convertedPrice: number;
  convertedLineTotal: number;
}

export interface OrderDTO {
  _id: string;
  orderNumber: string;
  customer: CheckoutCustomer;
  items: OrderItemDTO[];
  subtotal: number;
  total: number;
  currency: CurrencyCode;
  exchangeRate: number;
  convertedSubtotal: number;
  convertedTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed";
  paymentProvider?: "razorpay";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: "placed" | "cancelled";
  createdAt: string;
}
