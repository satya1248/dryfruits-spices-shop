import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as Partial<{
    name: string;
    slug: string;
    description: string;
    price: number;
    unit: string;
    categorySlug: string;
    imageUrl: string;
    inStock: boolean;
    featured: boolean;
    tags: string[];
  }>;

  await connectDB();

  const update: Record<string, unknown> = {};
  for (const key of ["name", "description", "unit", "imageUrl"] as const) {
    if (typeof body[key] === "string") update[key] = body[key]!.trim();
  }
  if (typeof body.slug === "string") update.slug = body.slug.trim().toLowerCase();
  if (typeof body.price === "number") update.price = body.price;
  if (typeof body.inStock === "boolean") update.inStock = body.inStock;
  if (typeof body.featured === "boolean") update.featured = body.featured;
  if (Array.isArray(body.tags)) update.tags = body.tags;

  if (typeof body.categorySlug === "string") {
    const category = await Category.findOne({ slug: body.categorySlug }).lean();
    if (!category) {
      return NextResponse.json({ error: "Invalid categorySlug" }, { status: 400 });
    }
    update.category = category._id;
  }

  const product = await Product.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: product });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const result = await Product.findByIdAndDelete(id).lean();
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: { ok: true } });
}

