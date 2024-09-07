import mongoose, { Schema, models } from "mongoose";

const activitySchema = new Schema(
  {
    // TODO: THINK OF values for the activity cluster
  },
  { timestamps: true }
);

const Activity = models.User || mongoose.model("activity", activitySchema);

export default Activity;
