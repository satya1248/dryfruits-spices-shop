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
}

export interface OrderDTO {
  _id: string;
  orderNumber: string;
  customer: CheckoutCustomer;
  items: OrderItemDTO[];
  subtotal: number;
  total: number;
  status: "placed" | "cancelled";
  createdAt: string;
}
