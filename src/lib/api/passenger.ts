"use server";

import Passenger from "@/models/Passenger";
import Queue from "@/models/Queue";
import { Passenger as PassengerTypes } from "../types";

export const addPassenger = async (
  passengerDetails: PassengerTypes,
  queueId: string
) => {
  try {
    const newPassenger = await Passenger.create(passengerDetails);

    await Queue.findByIdAndUpdate(
      queueId,
      { $push: { passengerIds: newPassenger._id } },
      { new: true }
    );

    return true;
  } catch (error) {
    console.error("Error adding passenger:", error);
    throw new Error("Failed to add passenger");
  }
};

export const fetchPassengers = async (passengerIds: string[]) => {
  try {
    const passengers = await Passenger.find({
      _id: { $in: passengerIds },
    }).lean();

    return passengers;
  } catch (error) {
    console.error("Error fetching passengers:", error);
    throw error;
  }
};
