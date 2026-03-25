import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
  CONNECTION_REQUEST = "CONNECTION_REQUEST",
  CONNECTION_ACCEPTED = "CONNECTION_ACCEPTED",
  POST_LIKE = "POST_LIKE",
  POST_COMMENT = "POST_COMMENT",
  COMMENT_LIKE = "COMMENT_LIKE",
  NEW_MESSAGE = "NEW_MESSAGE",
  JOB_APPLICATION = "JOB_APPLICATION",
}

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String, default: null },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
