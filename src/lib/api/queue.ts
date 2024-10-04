"use server";
import Boat from "@/models/Boats";
import { connectMongoDB } from "../db";
import Queue from "@/models/Queue";
import { revalidatePath } from "next/cache";
import { Queue } from "../types";

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
    connectMongoDB();
    const queue = await Queue.find({ status: "in-queue" }).sort({
      position: 1,
    });
    return (
      queue?.map((k) => ({
        id: k?._id.toString(),
        position: k?.position,
        boatName: k?.boatName,
        boatCode: k?.boatCode,
      })) ?? []
    );
  } catch (error) {
    console.log(error);
  }
  return [];
};

export const addQueue = async (
  id: string,
  boatName: string,
  boatCode: string,
  username: string
) => {
  try {
    connectMongoDB();
    const inQueueCount = await Queue.countDocuments({ status: "in-queue" });

    await Queue.create({
      boatId: id,
      boatName: boatName,
      boatCode: boatCode,
      createdBy: username,
      lastUpdatedBy: username,
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

export const updateQueuePositions = async (newItems: Queue[]) => {
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
