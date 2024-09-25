import mongoose, { Schema, models } from "mongoose";

const boatSchema = new Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
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
    status: {
      type: String,
      enum: ["Queueing", "Loading", "Standby"],
      default: "Standby",
    },
    registrationStatus: {
      type: String,
      enum: ["Registered", "Pending", "Unregistered"],
      default: "Unregistered",
    },
    boatFeatures: {
      type: String,
    },
    images: [String],
    additionalInfo: {
      type: String,
    },
    boatCode: {
      type: String,
      unique: true,
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Boat = models.Boat || mongoose.model("Boat", boatSchema);

export default Boat;
