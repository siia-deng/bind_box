import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
      index: true
    },
    date: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    seatsTaken: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", SessionSchema);
