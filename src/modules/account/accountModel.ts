import mongoose, { Schema, Document } from "mongoose";

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  provider: string;
  providerAccountId: string;
  accessToken: string | null;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    accessToken: { type: String, default: null },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });
AccountSchema.index({ userId: 1 });

export const Account = mongoose.model<IAccount>("Account", AccountSchema);
