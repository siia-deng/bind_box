import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
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
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    background: { type: String, required: true, trim: true },
    idea: { type: String, required: true, trim: true },
    paymentMethod: {
      type: String,
      enum: ["wechat", "alipay", "other"],
      default: "wechat"
    },
    payerName: { type: String, required: true, trim: true },
    paymentTail: { type: String, required: true, trim: true },
    verificationCode: { type: String, required: true, unique: true, trim: true },
    checkinStatus: {
      type: String,
      enum: ["not_checked_in", "checked_in"],
      default: "not_checked_in"
    },
    status: {
      type: String,
      enum: ["paid_pending_verify", "confirmed", "cancelled"],
      default: "paid_pending_verify"
    }
  },
  { timestamps: true }
);

export const Registration = mongoose.model("Registration", RegistrationSchema);
