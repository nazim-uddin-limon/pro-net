import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  deviceInfo: string;
  ipAddress: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
    deviceInfo: { type: String, default: "Unknown" },
    ipAddress: { type: String, default: "Unknown" },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ refreshToken: 1 });

export const Session = mongoose.model<ISession>("Session", SessionSchema);
