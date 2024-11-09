import mongoose, { Schema, models } from "mongoose";

const queueSchema = new Schema(
  {
    boatId: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["in-queue", "boarding", "sailing", "completed"],
      default: "in-queue",
    },
    passengerCount: {
      type: Number,
    },
    passengerIds: [
      {
        type: String,
      },
    ],
    queuedAt: {
      type: Date,
      default: Date.now,
    },
    estimatedDepartureTime: {
      type: Date,
    },
    createdBy: {
      type: String,
    },
    destination: {
      type: [String],
    },
    departureTime: {
      type: Date,
    },
    boardingAt: {
      type: Date,
    },
    sailedAt: {
      type: Date,
    },
    locationHistory: {
      currentLocation: String,
      timestamps: [
        {
          location: String,
          timestamp: Date,
        },
      ],
    },
    completedAt: {
      type: Date,
    },
    canceledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Queue = models.Queue || mongoose.model("Queue", queueSchema);

export default Queue;
