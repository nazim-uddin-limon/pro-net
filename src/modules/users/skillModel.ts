import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export const Skill = mongoose.model<ISkill>("Skill", SkillSchema);
