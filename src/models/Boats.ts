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
      unique: true,
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
    boatDetails: {
      type: String,
      required: true,
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
      type: Date,
    },
    checkingDetails: {
      type: String,
    },
  },
  { timestamps: true }
);

const Boat = models.Boat || mongoose.model("Boat", boatSchema);

export default Boat;
