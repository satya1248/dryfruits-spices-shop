import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/data/orders";
import type { CartItem, CheckoutCustomer } from "@/types";

interface OrderRequestBody {
  customer?: CheckoutCustomer;
  items?: Pick<CartItem, "productId" | "quantity">[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderRequestBody;

    if (!body.customer || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "Customer and cart items are required." },
        { status: 400 },
      );
    }

    const data = await createOrder({
      customer: body.customer,
      items: body.items,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
