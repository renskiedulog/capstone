import mongoose, { Schema, models } from "mongoose";

const queueSchema = new Schema(
  {
    boatCode: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    status: {
      enum: ["queued", "loading", "sailing"],
      default: "queued",
    },
  },
  { timestamps: true }
);

const Activity = models.Queue || mongoose.model("Queue", queueSchema);

export default Activity;
