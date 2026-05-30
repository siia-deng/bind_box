import mongoose from "mongoose";

const AgendaItemSchema = new mongoose.Schema(
  {
    time: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const WorkshopSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    longDescription: [{ type: String, trim: true }],
    audience: [{ type: String, trim: true }],
    outcomes: [{ type: String, trim: true }],
    agenda: [AgendaItemSchema],
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "open", "closed"],
      default: "draft"
    }
  },
  { timestamps: true }
);

export const Workshop = mongoose.model("Workshop", WorkshopSchema);
