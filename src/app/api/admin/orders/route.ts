import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listOrdersForAdmin } from "@/lib/data/orders";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await listOrdersForAdmin();
  return NextResponse.json({ data });
}
