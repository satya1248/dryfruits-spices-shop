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
