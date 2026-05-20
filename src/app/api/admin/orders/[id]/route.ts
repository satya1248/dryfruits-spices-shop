import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { updateOrderShipping } from "@/lib/data/orders";
import type { ShippingStatus } from "@/types";

const VALID_STATUSES: ShippingStatus[] = [
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = (await request.json()) as { shippingStatus?: string };

    if (!body.shippingStatus || !VALID_STATUSES.includes(body.shippingStatus as ShippingStatus)) {
      return NextResponse.json({ error: "Invalid shipping status" }, { status: 400 });
    }

    const data = await updateOrderShipping(id, body.shippingStatus as ShippingStatus);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
