import mongoose, { Schema, type InferSchemaType, type Model, type Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    imageUrl: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false, index: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

productSchema.index({ category: 1, featured: 1 });

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};

export const Product: Model<ProductDocument> =
  mongoose.models.Product ?? mongoose.model("Product", productSchema);
