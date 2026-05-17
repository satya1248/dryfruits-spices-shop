import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const data = await getProductBySlug(slug);

    if (!data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/products/[slug]:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
