import mongoose, { Schema, Document } from "mongoose";

export enum ConnectionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  BLOCKED = "BLOCKED",
}

export interface IConnection extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(ConnectionStatus),
      default: ConnectionStatus.PENDING,
    },
  },
  { timestamps: true }
);

ConnectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
ConnectionSchema.index({ senderId: 1 });
ConnectionSchema.index({ receiverId: 1 });
ConnectionSchema.index({ status: 1 });

export const Connection = mongoose.model<IConnection>("Connection", ConnectionSchema);
