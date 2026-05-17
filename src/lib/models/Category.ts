import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;

export const Category: Model<CategoryDocument> =
  mongoose.models.Category ?? mongoose.model("Category", categorySchema);
