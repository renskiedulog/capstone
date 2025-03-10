import mongoose, { Schema, models } from "mongoose";

const activitySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["teller", "boat", "queue"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    actionBy: String,
    link: String,
  },
  { timestamps: true }
);

const Activity = models.Activity || mongoose.model("Activity", activitySchema);

export default Activity;
