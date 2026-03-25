import mongoose, { Schema, Document } from "mongoose";

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
}

export interface IJob extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  location: string | null;
  remote: boolean;
  type: JobType;
  salary: string | null;
  skills: string[];
  closingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, default: null },
    remote: { type: Boolean, default: false },
    type: {
      type: String,
      enum: Object.values(JobType),
      default: JobType.FULL_TIME,
    },
    salary: { type: String, default: null },
    skills: { type: [String], default: [] },
    closingDate: { type: Date, default: null },
  },
  { timestamps: true }
);

JobSchema.index({ companyId: 1, createdAt: -1 });
JobSchema.index({ title: "text", description: "text" });
JobSchema.index({ location: 1 });
JobSchema.index({ type: 1 });
JobSchema.index({ remote: 1 });

export const Job = mongoose.model<IJob>("Job", JobSchema);
