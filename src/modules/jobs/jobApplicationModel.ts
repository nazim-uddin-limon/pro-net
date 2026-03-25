import mongoose, { Schema, Document } from "mongoose";

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  REVIEWED = "REVIEWED",
  SHORTLISTED = "SHORTLISTED",
  REJECTED = "REJECTED",
  HIRED = "HIRED",
}

export interface IJobApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resumeUrl: string | null;
  coverLetter: string | null;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, default: null },
    coverLetter: { type: String, default: null },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

JobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
JobApplicationSchema.index({ userId: 1, appliedAt: -1 });
JobApplicationSchema.index({ status: 1 });

export const JobApplication = mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
