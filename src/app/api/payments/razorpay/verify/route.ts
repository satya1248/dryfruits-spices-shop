import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOrderById } from "@/lib/data/orders";
import { dispatchOrderPlaced } from "@/lib/notifications";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

interface VerifyBody {
  orderId?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Razorpay secret not configured" },
        { status: 500 },
      );
    }

    const body = (await request.json()) as VerifyBody;

    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing Razorpay verification fields" },
        { status: 400 },
      );
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json({ error: "Razorpay order mismatch" }, { status: 400 });
    }

    order.paymentMethod = "razorpay";
    order.paymentProvider = "razorpay";
    order.paymentStatus = "paid";
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    const orderDto = await getOrderById(orderId);
    if (orderDto) {
      dispatchOrderPlaced(orderDto);
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    console.error("POST /api/payments/razorpay/verify:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
