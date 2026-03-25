import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  companyId: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyId: { type: String, default: null },
    location: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

ExperienceSchema.index({ userId: 1 });

export const Experience = mongoose.model<IExperience>("Experience", ExperienceSchema);
