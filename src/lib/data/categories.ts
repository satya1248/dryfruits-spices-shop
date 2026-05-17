import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import type { CategoryDTO } from "@/types";

function toCategoryDTO(doc: {
  _id: { toString(): string };
  name: string;
  slug: string;
  description?: string | null;
}): CategoryDTO {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? undefined,
  };
}

export async function getCategories(): Promise<CategoryDTO[]> {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return categories.map(toCategoryDTO);
}
