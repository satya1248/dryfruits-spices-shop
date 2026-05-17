import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import type { CategoryDTO, ProductDTO, ProductFilters } from "@/types";

function toCategoryDTO(doc: {
  _id: { toString(): string };
  name: string;
  slug: string;
  description?: string;
}): CategoryDTO {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
  };
}

function toProductDTO(doc: Record<string, unknown>): ProductDTO {
  const category = doc.category as Record<string, unknown> | undefined;
  return {
    _id: (doc._id as { toString(): string }).toString(),
    name: doc.name as string,
    slug: doc.slug as string,
    description: doc.description as string,
    price: doc.price as number,
    unit: doc.unit as string,
    category:
      category && typeof category === "object" && "_id" in category
        ? toCategoryDTO(category as Parameters<typeof toCategoryDTO>[0])
        : String(category),
    imageUrl: doc.imageUrl as string,
    inStock: doc.inStock as boolean,
    featured: doc.featured as boolean,
    tags: doc.tags as string[] | undefined,
  };
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductDTO[]> {
  await connectDB();

  const query: Record<string, unknown> = {};

  if (filters.category) {
    const { Category } = await import("@/lib/models/Category");
    const cat = await Category.findOne({ slug: filters.category }).lean();
    if (cat) {
      query.category = cat._id;
    }
  }

  if (filters.featured === true) {
    query.featured = true;
  }

  if (filters.search) {
    const regex = new RegExp(filters.search, "i");
    query.$or = [{ name: regex }, { description: regex }, { tags: regex }];
  }

  const products = await Product.find(query)
    .populate("category")
    .sort({ name: 1 })
    .lean();

  return products.map((p) => toProductDTO(p as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  await connectDB();
  const product = await Product.findOne({ slug }).populate("category").lean();
  if (!product) return null;
  return toProductDTO(product as Record<string, unknown>);
}
