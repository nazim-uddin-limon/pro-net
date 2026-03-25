import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  userId: mongoose.Types.ObjectId;
  school: string;
  degree: string | null;
  field: string | null;
  startYear: number;
  endYear: number | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    school: { type: String, required: true },
    degree: { type: String, default: null },
    field: { type: String, default: null },
    startYear: { type: Number, required: true },
    endYear: { type: Number, default: null },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

EducationSchema.index({ userId: 1 });

export const Education = mongoose.model<IEducation>("Education", EducationSchema);
