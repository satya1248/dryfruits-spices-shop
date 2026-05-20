import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const products = await Product.find().populate("category").sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: products });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    unit?: string;
    categorySlug?: string;
    imageUrl?: string;
    inStock?: boolean;
    featured?: boolean;
    tags?: string[];
  };

  await connectDB();

  const category = body.categorySlug
    ? await Category.findOne({ slug: body.categorySlug }).lean()
    : null;

  if (!category) {
    return NextResponse.json({ error: "Valid categorySlug is required" }, { status: 400 });
  }

  const doc = await Product.create({
    name: body.name?.trim(),
    slug: body.slug?.trim()?.toLowerCase(),
    description: body.description?.trim(),
    price: body.price,
    unit: body.unit?.trim(),
    category: category._id,
    imageUrl: body.imageUrl?.trim(),
    inStock: body.inStock ?? true,
    featured: body.featured ?? false,
    tags: body.tags ?? [],
  });

  return NextResponse.json({ data: doc }, { status: 201 });
}

