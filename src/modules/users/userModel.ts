import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string | null;
  name: string;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  location: string | null;
  website: string | null;
  openToWork: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    headline: { type: String, default: null },
    bio: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    bannerUrl: { type: String, default: null },
    location: { type: String, default: null },
    website: { type: String, default: null },
    openToWork: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ name: "text" });

export const User = mongoose.model<IUser>("User", UserSchema);
