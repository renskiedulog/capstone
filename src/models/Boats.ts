import mongoose, { Schema, models } from "mongoose";

const boatSchema = new Schema(
  {
    boatCode: {
      type: String,
      unique: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    driverName: String,
    boatName: {
      type: String,
      required: true,
    },
    mainImage: String,
    capacity: {
      type: Number,
      required: true,
    },
    boatFeatures: {
      type: String,
    },
    images: [String],
    additionalInfo: {
      type: String,
    },
    ownerContactNumber: {
      type: String,
      required: true,
    },
    driverContactNumber: {
      type: String,
      required: true,
    },
    lastCheck: {
      type: String,
    },
    checkingDetails: {
      type: String,
    },
    checkingStatus: {
      type: String,
      enum: [
        "not-checked",
        "checked",
        "pending",
        "under-inspection",
        "requires-repair",
        "not-sailable",
      ],
      default: "not-checked",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Boat = models.Boat || mongoose.model("Boat", boatSchema);

export default Boat;
