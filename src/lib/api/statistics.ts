"use server";
import Boat from "@/models/Boats";
import Queue from "@/models/Queue";
import Passenger from "@/models/Passenger";
import { connectMongoDB } from "../db";
import { getDateRange, getPreviousRange } from "../utils";

export const getTotalPassengers = async () => {
  return await Passenger.countDocuments();
};

export const getQueueSummary = async () => {
  try {
    await connectMongoDB();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const queueSummary = await Queue.aggregate([
      {
        $match: {
          $or: [
            { status: { $ne: "completed" } },
            {
              status: "completed",
              updatedAt: { $gte: startOfDay, $lte: endOfDay },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalPassengers: { $sum: { $size: "$passengerIds" } },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          totalPassengers: 1,
          _id: 0,
        },
      },
    ]);

    const totalFareEarnedData = await Passenger.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalFareEarned: { $sum: "$amountPaid" },
        },
      },
    ]);

    const totalFareEarned =
      totalFareEarnedData.length > 0
        ? totalFareEarnedData[0].totalFareEarned
        : 0;

    const formattedData = queueSummary.map((item) => ({
      status: item.status,
      count: item.count,
      totalPassengers: item.totalPassengers || 0,
    }));

    const totalQueued = formattedData.reduce(
      (sum, item) => sum + item.count,
      0
    );
    const totalPassengers = formattedData.reduce(
      (sum, item) => sum + item.totalPassengers,
      0
    );

    return {
      formattedData,
      totalQueued,
      totalPassengers,
      totalFareEarned,
    };
  } catch (error) {
    console.error("Error fetching queue summary:", error);
    throw new Error("Failed to fetch queue summary data");
  }
};

export async function getPassengerDensity() {
  const endDate = new Date();
  endDate.setUTCHours(23, 59, 59, 999);

  const dates = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  const data = await Passenger.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(dates[4]),
          $lte: endDate,
        },
      },
    },
    {
      $project: {
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
      },
    },
    {
      $group: {
        _id: "$date",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const formattedData = dates.reverse().map((date) => {
    const found = data.find((item) => item._id === date);
    return {
      date,
      count: found ? found.count : 0,
    };
  });

  return formattedData;
}

export const getSailsCountWithPercentage = async (range: string) => {
  try {
    const { start, end } = getDateRange(range);
    const { start: prevStart, end: prevEnd } = getPreviousRange(range);

    const currentCount = await Queue.countDocuments({
      status: "completed",
      completedAt: { $gte: start, $lte: end },
    });

    const previousCount = await Queue.countDocuments({
      status: "completed",
      completedAt: { $gte: prevStart, $lte: prevEnd },
    });

    const percentageDifference =
      previousCount === 0
        ? currentCount > 0
          ? 100
          : 0
        : ((currentCount - previousCount) / previousCount) * 100;

    return {
      currentCount,
      previousCount,
      percentageDifference,
    };
  } catch (error) {
    console.error(
      "Error fetching sails count and percentage difference:",
      error
    );
    throw new Error("Unable to fetch sails count and percentage difference");
  }
};

export const getPassengerCountWithPercentage = async (range: string) => {
  try {
    const { start, end } = getDateRange(range);
    const { start: prevStart, end: prevEnd } = getPreviousRange(range);

    const currentCount = await Passenger.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const previousCount = await Passenger.countDocuments({
      createdAt: { $gte: prevStart, $lte: prevEnd },
    });

    const percentageDifference =
      previousCount === 0
        ? currentCount > 0
          ? 100
          : 0
        : ((currentCount - previousCount) / previousCount) * 100;

    return {
      currentCount,
      previousCount,
      percentageDifference,
    };
  } catch (error) {
    console.error(
      "Error fetching sails count and percentage difference:",
      error
    );
    throw new Error("Unable to fetch sails count and percentage difference");
  }
};
