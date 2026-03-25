import mongoose, { Schema, Document } from "mongoose";

export enum PostVisibility {
  PUBLIC = "PUBLIC",
  CONNECTIONS_ONLY = "CONNECTIONS_ONLY",
}

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  content: string;
  mediaUrls: string[];
  visibility: PostVisibility;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    mediaUrls: { type: [String], default: [] },
    visibility: {
      type: String,
      enum: Object.values(PostVisibility),
      default: PostVisibility.PUBLIC,
    },
  },
  { timestamps: true }
);

PostSchema.index({ authorId: 1, createdAt: -1 });
PostSchema.index({ visibility: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>("Post", PostSchema);
