import mongoose, { Schema, models } from "mongoose";

const passengerSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    phoneNumber: {
      type: String,
    },
    amountPaid: {
      type: Number,
    },
    queueId: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Passenger =
  models.Passenger || mongoose.model("Passenger", passengerSchema);

export default Passenger;
