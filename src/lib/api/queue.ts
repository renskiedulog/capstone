"use server";
import Boat from "@/models/Boats";
import { connectMongoDB } from "../db";
import Queue from "@/models/Queue";
import { Queue as QueueTypes } from "../types";
import Passenger from "@/models/Passenger";

export const fetchBoatIds = async () => {
  try {
    const boats = await Boat.find()
      .select("_id boatName boatCode capacity")
      .lean();
    return boats?.map((boat) => ({
      boatName: boat?.boatName,
      id: boat?._id?.toString(),
      boatCode: boat?.boatCode,
      capacity: boat?.capacity,
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
  return true;
};

export const updateQueuePositions = async (newItems: QueueTypes[]) => {
  try {
    const updatePromises = newItems.map((item) =>
      Queue.findByIdAndUpdate(item.id, { position: item.position })
    );

    await Promise.all(updatePromises);

    return true;
  } catch (error) {
    console.error("Error updating queue positions:", error);
    return false;
  }
};

export const changeToBoarding = async (
  queueId: string,
  destination: string[]
) => {
  try {
    await connectMongoDB();

    const result = await Queue.findByIdAndUpdate(
      queueId,
      {
        $set: {
          status: "boarding",
          boardingAt: new Date(),
          position: null,
          destination: destination ?? null,
          currentLocation: destination[0] ?? null,
        },
      },
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

export const deleteBoarding = async (id: string) => {
  await connectMongoDB();

  const session = await Queue.startSession();
  session.startTransaction();

  try {
    const queueDeletion = await Queue.deleteOne({ _id: id }).session(session);
    if (queueDeletion.deletedCount === 0) {
      throw new Error("Queue not found or already deleted");
    }

    await Passenger.deleteMany({ queueId: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting queue and passengers:", error);
    throw error;
  }
};

export const changeToSailing = async (queueId: string) => {
  try {
    await connectMongoDB();

    const result = await Queue.findByIdAndUpdate(
      queueId,
      {
        $set: {
          status: "sailing",
          sailedAt: new Date(),
        },
      },
      { new: true }
    );

    if (result) {
      return { success: true, message: "Boat status updated to sailing." };
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

export const fetchSailing = async () => {
  try {
    await connectMongoDB();

    const sailingBoats = await Queue.find({ status: "sailing" })
      .sort({ sailedAt: -1 })
      .lean();
    const boatIds = sailingBoats.map((boat) => boat.boatId);
    const boats = await Boat.find({ _id: { $in: boatIds } }).lean();
    const boatMap = boats.reduce((acc: any, boat: any) => {
      acc[boat._id.toString()] = {
        mainImage: boat.mainImage,
        capacity: boat.capacity,
        boatName: boat.boatName,
        boatCode: boat.boatCode,
        driverName: boat.driverName,
        currentLocation: boat.currentLocation,
      };
      return acc;
    }, {});

    const sailingBoatsWithImages = sailingBoats.map((queueBoat) => {
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

    return sailingBoatsWithImages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateCurrentLocation = async (id: string, location: string) => {
  try {
    await connectMongoDB();

    const queueItem = await Queue.findById(id);

    if (!queueItem) {
      return { success: false, message: "Boat not found." };
    }

    const updatedTimeStamps = [
      { location, timestamp: new Date() },
      ...(queueItem.locationHistory?.timestamps || []),
    ];

    queueItem.locationHistory = {
      currentLocation: location,
      timestamps: updatedTimeStamps,
    };

    await queueItem.save();

    return { success: true, message: "Boat current location updated." };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while updating location.",
    };
  }
};

export const completeSail = async (queueId: string) => {
  try {
    await connectMongoDB();

    const result = await Queue.findByIdAndUpdate(
      queueId,
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
        },
      },
      { new: true }
    );

    if (result) {
      return { success: true, message: "Boat has completed its sails." };
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

export const fetchRecentSails = async () => {
  try {
    await connectMongoDB();

    const recentSails = await Queue.find({ status: "completed" })
      .sort({ boardingAt: -1 })
      .lean();

    const boatIds = recentSails.map((boat) => boat.boatId);
    const boats = await Boat.find({ _id: { $in: boatIds } }).lean();

    const boatMap = boats.reduce((acc, boat) => {
      acc[boat._id.toString()] = {
        mainImage: boat.mainImage,
        capacity: boat.capacity,
        boatName: boat.boatName,
        boatCode: boat.boatCode,
        driverName: boat.driverName,
        currentLocation: boat.currentLocation,
      };
      return acc;
    }, {});

    const sailingBoatsWithImages = await Promise.all(
      recentSails.map(async (queueBoat) => {
        const boatData = boatMap[queueBoat.boatId.toString()] || {};

        const passengers = await Passenger.find({
          _id: { $in: queueBoat.passengerIds },
        }).lean();

        const totalAmountPaid = passengers.reduce((sum, passenger) => {
          return sum + (passenger.amountPaid || 0);
        }, 0);

        return {
          ...queueBoat,
          mainImage: boatData.mainImage || null,
          capacity: boatData.capacity || 0,
          boatName: boatData.boatName || "",
          boatCode: boatData.boatCode || "",
          driverName: boatData.driverName || "",
          totalAmountPaid,
        };
      })
    );

    return sailingBoatsWithImages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchSailDetails = async (id: string) => {
  try {
    await connectMongoDB();

    const boardingBoat: any = await Queue.findById(id)
      .sort({ boardingAt: -1 })
      .lean();

    if (!boardingBoat) {
      return null;
    }

    const boat: any = await Boat.findById(boardingBoat.boatId).lean();

    return {
      ...boardingBoat,
      mainImage: boat?.mainImage || null,
      capacity: boat?.capacity || 0,
      boatName: boat?.boatName || "",
      boatCode: boat?.boatCode || "",
      driverName: boat?.driverName || "",
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteSailHistories = async (ids: string[]) => {
  try {
    await connectMongoDB();

    const result = await Queue.deleteMany({ _id: { $in: ids } });

    return result;
  } catch (error) {
    return { deletedCount: 0, error };
  }
};
