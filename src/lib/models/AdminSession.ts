import mongoose, { Schema, type InferSchemaType, type Model, type Types } from "mongoose";

const adminSessionSchema = new Schema(
  {
    adminUser: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AdminSessionDocument = InferSchemaType<typeof adminSessionSchema> & {
  _id: Types.ObjectId;
};

export const AdminSession: Model<AdminSessionDocument> =
  mongoose.models.AdminSession ?? mongoose.model("AdminSession", adminSessionSchema);
