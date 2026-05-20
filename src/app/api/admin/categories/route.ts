import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import { Category } from "@/lib/models/Category";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json({ data: categories });
}

