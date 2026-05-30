import mongoose from "mongoose";

const BrandPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    eyebrow: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    sections: [
      {
        heading: { type: String, required: true, trim: true },
        copy: { type: String, required: true, trim: true }
      }
    ],
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const BrandPage = mongoose.model("BrandPage", BrandPageSchema);
