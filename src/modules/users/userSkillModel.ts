import mongoose, { Schema, Document } from "mongoose";

export interface IUserSkill extends Document {
  userId: mongoose.Types.ObjectId;
  skillId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const UserSkillSchema = new Schema<IUserSkill>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    skillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
  },
  { timestamps: true }
);

UserSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });
UserSkillSchema.index({ skillId: 1 });

export const UserSkill = mongoose.model<IUserSkill>("UserSkill", UserSkillSchema);
