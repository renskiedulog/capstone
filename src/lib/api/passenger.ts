"use server";

import Passenger from "@/models/Passenger";
import Queue from "@/models/Queue";
import { Passenger as PassengerTypes } from "../types";
import { connectMongoDB } from "../db";

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
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const plainPassengers = passengers.map((passenger: any) => ({
      ...passenger,
      _id: passenger._id.toString(),
    }));

    return plainPassengers;
  } catch (error) {
    console.error("Error fetching passengers:", error);
    throw error;
  }
};

export const deletePassenger = async (passengerId: string, queueId: string) => {
  try {
    await Passenger.findByIdAndDelete(passengerId);

    await Queue.findByIdAndUpdate(
      queueId,
      { $pull: { passengerIds: passengerId } },
      { new: true }
    );

    return true;
  } catch (error) {
    console.error("Error deleting passenger:", error);
    throw new Error("Failed to delete passenger");
  }
};

export const fetchAllPassengers = async () => {
  try {
    const passengers = await Passenger.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const plainPassengers = passengers.map((passenger: any) => ({
      ...passenger,
      _id: passenger._id.toString(),
    }));

    return plainPassengers;
  } catch (error) {
    console.error("Error fetching passengers:", error);
    throw error;
  }
};
