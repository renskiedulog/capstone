import mongoose, { Schema, models } from "mongoose";

const passengerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    queueId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Passenger =
  models.Passenger || mongoose.model("Passenger", passengerSchema);

export default Passenger;
