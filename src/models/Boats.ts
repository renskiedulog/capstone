import mongoose, { Schema, models } from "mongoose";

const boatSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Boat = models.Boat || mongoose.model("Boat", boatSchema);

export default Boat;
