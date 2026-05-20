import { NextRequest, NextResponse } from "next/server";
import { trackOrder } from "@/lib/data/orders";

export async function GET(request: NextRequest) {
  try {
    const orderNumber = request.nextUrl.searchParams.get("orderNumber") ?? "";
    const email = request.nextUrl.searchParams.get("email") ?? "";

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required." },
        { status: 400 },
      );
    }

    const data = await trackOrder(orderNumber, email);

    if (!data) {
      return NextResponse.json(
        { error: "No order found for that order number and email." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/orders/track:", error);
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 },
    );
  }
}
