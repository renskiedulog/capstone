"use server";

import Passenger from "@/models/Passenger";
import Queue from "@/models/Queue";
import { Passenger as PassengerTypes } from "../types";

export const addPassenger = async (passengerDetails: PassengerTypes) => {
  try {
    const newPassenger = await Passenger.create(passengerDetails);

    await Queue.findByIdAndUpdate(
      passengerDetails.queueId,
      { $push: { passengerIds: newPassenger._id } },
      { new: true }
    );

    return newPassenger;
  } catch (error) {
    console.error("Error adding passenger:", error);
    throw new Error("Failed to add passenger");
  }
};
