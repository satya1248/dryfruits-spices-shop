import mongoose, { Schema, type InferSchemaType, type Model, type Types } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    slug: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, required: true },
    lineTotal: { type: Number, required: true, min: 0 },
    convertedPrice: { type: Number, required: true, min: 0 },
    convertedLineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: customerSchema, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP", "AED", "SGD"],
      default: "INR",
      required: true,
    },
    exchangeRate: { type: Number, default: 1, required: true, min: 0 },
    convertedSubtotal: { type: Number, required: true, min: 0 },
    convertedTotal: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["cod", "upi", "razorpay"],
      default: "cod",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
    },
    paymentProvider: { type: String, enum: ["razorpay"] },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    status: {
      type: String,
      enum: ["placed", "cancelled"],
      default: "placed",
      required: true,
    },
    shippingStatus: {
      type: String,
      enum: ["processing", "packed", "shipped", "out_for_delivery", "delivered"],
      default: "processing",
      required: true,
      index: true,
    },
    trackingNumber: { type: String, trim: true, index: true },
    carrier: { type: String, trim: true, default: "Bala Balaji Delivery" },
    shippingUpdates: [
      {
        status: {
          type: String,
          enum: ["processing", "packed", "shipped", "out_for_delivery", "delivered"],
          required: true,
        },
        message: { type: String, required: true, trim: true },
        at: { type: Date, required: true, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
};

export const Order: Model<OrderDocument> =
  mongoose.models.Order ?? mongoose.model("Order", orderSchema);
