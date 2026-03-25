import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    logoUrl: { type: String, default: null },
    website: { type: String, default: null },
    industry: { type: String, default: null },
    size: { type: String, default: null },
    location: { type: String, default: null },
  },
  { timestamps: true }
);

CompanySchema.index({ name: "text" });
CompanySchema.index({ industry: 1 });

export const Company = mongoose.model<ICompany>("Company", CompanySchema);
