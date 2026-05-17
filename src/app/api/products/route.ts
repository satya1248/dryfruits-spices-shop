import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/data/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const featuredParam = searchParams.get("featured");
    const featured =
      featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;

    const data = await getProducts({ category, search, featured });
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
