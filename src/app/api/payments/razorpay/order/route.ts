import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { getRazorpayClient, getRazorpayKeyId } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { orderId?: string };
    const orderId = body.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json({ error: "Order is already paid" }, { status: 400 });
    }

    // Razorpay works in the smallest currency unit (paise).
    // This project stores base prices in INR, so use INR totals for online payments.
    const amountPaise = Math.round(order.total * 100);

    const receipt = `order_${order._id.toString()}_${crypto.randomUUID().slice(0, 8)}`;
    const razorpay = getRazorpayClient();
    const rpOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    });

    if (order.paymentMethod !== "upi") {
      order.paymentMethod = "razorpay";
    }
    order.paymentProvider = "razorpay";
    order.razorpayOrderId = rpOrder.id;
    await order.save();

    return NextResponse.json({
      data: {
        keyId: getRazorpayKeyId(),
        razorpayOrderId: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error("POST /api/payments/razorpay/order:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 },
    );
  }
}
