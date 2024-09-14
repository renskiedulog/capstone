import mongoose, { Schema, models } from "mongoose";

const activitySchema = new Schema(
  {
    type: {
      type: String,
      enum: ['teller', 'boat', 'passenger', 'queue'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    details: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Activity = models.Activity || mongoose.model("Activity", activitySchema);

export default Activity;
