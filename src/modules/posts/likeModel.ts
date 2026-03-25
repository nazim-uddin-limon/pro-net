import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId | null;
  commentId: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true, sparse: true });
LikeSchema.index({ userId: 1, commentId: 1 }, { unique: true, sparse: true });
LikeSchema.index({ postId: 1 });
LikeSchema.index({ commentId: 1 });

export const Like = mongoose.model<ILike>("Like", LikeSchema);
