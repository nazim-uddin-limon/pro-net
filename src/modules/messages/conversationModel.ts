import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {},
  { timestamps: true }
);

ConversationSchema.index({ lastMessageAt: -1 });

export const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
