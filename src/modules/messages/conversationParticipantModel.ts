import mongoose, { Schema, Document } from "mongoose";

export interface IConversationParticipant extends Document {
  conversationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationParticipantSchema = new Schema<IConversationParticipant>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

ConversationParticipantSchema.index({ conversationId: 1, userId: 1 }, { unique: true });
ConversationParticipantSchema.index({ userId: 1 });

export const ConversationParticipant = mongoose.model<IConversationParticipant>("ConversationParticipant", ConversationParticipantSchema);
