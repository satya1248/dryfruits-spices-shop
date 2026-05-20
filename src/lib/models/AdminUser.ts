import mongoose, { Schema, type InferSchemaType, type Model, type Types } from "mongoose";

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type AdminUserDocument = InferSchemaType<typeof adminUserSchema> & {
  _id: Types.ObjectId;
};

export const AdminUser: Model<AdminUserDocument> =
  mongoose.models.AdminUser ?? mongoose.model("AdminUser", adminUserSchema);
