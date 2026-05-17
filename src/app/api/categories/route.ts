import { NextResponse } from "next/server";
import { getCategories } from "@/lib/data/categories";

export async function GET() {
  try {
    const data = await getCategories();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
