import mongoose from "mongoose";

const ShowcaseProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    maker: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
      index: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true
    },
    eventDate: { type: String, required: true, trim: true, index: true },
    tags: [{ type: String, trim: true }],
    link: { type: String, trim: true },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ShowcaseProject = mongoose.model("ShowcaseProject", ShowcaseProjectSchema);
