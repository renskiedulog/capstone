"use server";
import Boat from "@/models/Boats";
import { connectMongoDB } from "../db";
import Queue from "@/models/Queue";
import { revalidatePath } from "next/cache";
import { Queue as QueueTypes } from "../types";

export const fetchBoatIds = async () => {
  try {
    const boats = await Boat.find()
      .select("_id boatName boatCode mainImage")
      .lean();
    return boats?.map((boat) => ({
      boatName: boat?.boatName,
      id: boat?._id?.toString(),
      boatCode: boat?.boatCode,
    }));
  } catch (error) {
    console.error("Error fetching boat IDs:", error);
    return [];
  }
};

export const fetchQueue = async () => {
  try {
    await connectMongoDB();

    const queues = await Queue.find({ status: "in-queue" })
      .sort({ position: 1 })
      .lean();

    const boatIds = queues.map((queue) => queue?.boatId);

    const boats = await Boat.find({ _id: { $in: boatIds } }).lean();

    const boatMap = boats.reduce((acc: any, boat: any) => {
      acc[boat._id.toString()] = {
        boatCode: boat.boatCode,
        boatName: boat.boatName,
        driverName: boat.driverName,
        capacity: boat.capacity,
      };
      return acc;
    }, {});

    const updatedQueues = [];
    const queuesToDelete = [];

    for (const { _id, boatId, ...rest } of queues) {
      if (boatMap[boatId.toString()]) {
        updatedQueues.push({
          id: _id?.toString(),
          boatCode: boatMap[boatId.toString()].boatCode,
          boatName: boatMap[boatId.toString()].boatName,
          driverName: boatMap[boatId.toString()].driverName,
          capacity: boatMap[boatId.toString()].capacity,
          ...rest,
        });
      } else {
        queuesToDelete.push(_id);
      }
    }

    if (queuesToDelete.length > 0) {
      await Queue.deleteMany({ _id: { $in: queuesToDelete } });
    }

    const reorderedQueues = updatedQueues.sort(
      (a: any, b: any) => a.position - b.position
    );

    return reorderedQueues;
  } catch (error) {
    console.error("Error fetching queue:", error);
  }
  return [];
};

export const addQueue = async (id: string, username: string) => {
  try {
    connectMongoDB();
    const inQueueCount = await Queue.countDocuments({ status: "in-queue" });

    await Queue.create({
      boatId: id,
      createdBy: username,
      position: inQueueCount + 1,
      status: "in-queue",
    });
    revalidatePath("/queue");
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const deleteQueueItem = async (queueId: string) => {
  const itemToDelete = await Queue.findById(queueId);

  if (itemToDelete) {
    const position = itemToDelete.position;

    await Queue.deleteOne({ _id: queueId });

    await Queue.updateMany(
      { position: { $gt: position } },
      { $inc: { position: -1 } }
    );
  }
  revalidatePath("/queue");
  return true;
};

export const updateQueuePositions = async (newItems: QueueTypes[]) => {
  try {
    const updatePromises = newItems.map((item) =>
      Queue.findByIdAndUpdate(item.id, { position: item.position })
    );

    await Promise.all(updatePromises);

    revalidatePath("/queue");

    return true;
  } catch (error) {
    console.error("Error updating queue positions:", error);
    return false;
  }
};

export const changeToBoarding = async (queueId: string) => {
  try {
    await connectMongoDB();

    const result = await Queue.findByIdAndUpdate(
      queueId,
      { $set: { status: "boarding", boardingAt: new Date(), position: null } },
      { new: true }
    );

    if (result) {
      return { success: true, message: "Boat status updated to boarding." };
    } else {
      return { success: false, message: "Boat not found." };
    }
  } catch (error) {
    console.error("Error changing boat status:", error);
    return {
      success: false,
      message: "An error occurred while updating the boat status.",
    };
  }
};

export const fetchBoarding = async () => {
  try {
    await connectMongoDB();

    const boardingBoats = await Queue.find({ status: "boarding" })
      .sort({ boardingAt: -1 })
      .lean();
    const boatIds = boardingBoats.map((boat) => boat.boatId);
    const boats = await Boat.find({ _id: { $in: boatIds } }).lean();
    const boatMap = boats.reduce((acc: any, boat: any) => {
      acc[boat._id.toString()] = {
        mainImage: boat.mainImage,
        capacity: boat.capacity,
        boatName: boat.boatName,
        boatCode: boat.boatCode,
        driverName: boat.driverName,
      };
      return acc;
    }, {});

    const boardingBoatsWithImages = boardingBoats.map((queueBoat) => {
      const boatData = boatMap[queueBoat.boatId.toString()] || {};

      return {
        ...queueBoat,
        mainImage: boatData.mainImage || null,
        capacity: boatData.capacity || 0,
        boatName: boatData.boatName || "",
        boatCode: boatData.boatCode || "",
        driverName: boatData.driverName || "",
      };
    });

    return boardingBoatsWithImages;
  } catch (error) {
    console.log(error);
    return [];
  }
};
