"use server";
import Boat from "@/models/Boats";
import Queue from "@/models/Queue";
import Passenger from "@/models/Passenger";
import { connectMongoDB } from "../db";
import { formatTime, getDateRange, getPreviousRange } from "../utils";

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
    return {};
  }
};

export const getQueueSummaryByRange = async (range = "today") => {
  try {
    await connectMongoDB();

    const { start, end } = getDateRange(range);

    const startOfDay = new Date(start);
    const endOfDay = new Date(end);

    const queueSummary = await Queue.aggregate([
      {
        $match: {
          updatedAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $project: {
          status: 1,
          queueTime: {
            $cond: [
              { $and: ["$queuedAt", "$boardingAt"] },
              { $subtract: ["$boardingAt", "$queuedAt"] },
              null,
            ],
          },
          boardingTime: {
            $cond: [
              { $and: ["$boardingAt", "$sailedAt"] },
              { $subtract: ["$sailedAt", "$boardingAt"] },
              null,
            ],
          },
          sailingTime: {
            $cond: [
              { $and: ["$sailedAt", "$completedAt"] },
              { $subtract: ["$completedAt", "$sailedAt"] },
              null,
            ],
          },
          queuedAt: 1,
          completedAt: 1,
        },
      },
      {
        $group: {
          _id: null,
          averageQueueTime: { $avg: "$queueTime" },
          averageBoardingTime: { $avg: "$boardingTime" },
          averageSailingTime: { $avg: "$sailingTime" },
          totalBoats: { $sum: 1 },
          longestTime: { $max: { $subtract: ["$completedAt", "$queuedAt"] } },
          earliestTime: { $min: { $subtract: ["$completedAt", "$queuedAt"] } }, // Earliest time from queued to completed
        },
      },
      {
        $project: {
          _id: 0,
          averageQueueTime: { $divide: ["$averageQueueTime", 1000] }, // Convert to seconds
          averageBoardingTime: { $divide: ["$averageBoardingTime", 1000] }, // Convert to seconds
          averageSailingTime: { $divide: ["$averageSailingTime", 1000] }, // Convert to seconds
          totalBoats: 1,
          longestTime: { $divide: ["$longestTime", 1000] }, // Convert to seconds
          earliestTime: { $divide: ["$earliestTime", 1000] }, // Convert to seconds
        },
      },
    ]);

    const formattedData = {
      averageQueueTime:
        queueSummary.length > 0 ? queueSummary[0].averageQueueTime : 0,
      averageBoardingTime:
        queueSummary.length > 0 ? queueSummary[0].averageBoardingTime : 0,
      averageSailingTime:
        queueSummary.length > 0 ? queueSummary[0].averageSailingTime : 0,
      totalBoats: queueSummary.length > 0 ? queueSummary[0].totalBoats : 0,
      longestTime:
        queueSummary.length > 0
          ? formatTime(queueSummary[0]?.longestTime)
          : "N/A",
      earliestTime:
        queueSummary.length > 0
          ? formatTime(queueSummary[0]?.earliestTime)
          : "N/A", // Now it will show the earliest queue-to-completion time
    };

    return formattedData;
  } catch (error) {
    console.error("Error fetching queue summary:", error);
    return {};
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

export const getTotalFareEarnedByRange = async (range: string) => {
  try {
    const { start, end } = getDateRange(range);
    const { start: prevStart, end: prevEnd } = getPreviousRange(range);

    const currentTotalFare = await Passenger.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountPaid" },
        },
      },
    ]);

    const previousTotalFare = await Passenger.aggregate([
      {
        $match: {
          createdAt: { $gte: prevStart, $lte: prevEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountPaid" },
        },
      },
    ]);

    const currentTotal = currentTotalFare[0]?.total || 0;
    const previousTotal = previousTotalFare[0]?.total || 0;

    const percentageDifference =
      previousTotal === 0
        ? currentTotal > 0
          ? 100
          : 0
        : ((currentTotal - previousTotal) / previousTotal) * 100;

    return {
      currentTotal,
      previousTotal,
      percentageDifference,
    };
  } catch (error) {
    console.error(
      "Error fetching total fare and percentage difference:",
      error
    );
    throw new Error("Unable to fetch total fare and percentage difference");
  }
};

export const getAverageQueueTimeByRange = async (range: string) => {
  try {
    const { start, end } = getDateRange(range);
    const { start: prevStart, end: prevEnd } = getPreviousRange(range);

    const calculateAverageTime = async (startDate: Date, endDate: Date) => {
      const result = await Queue.aggregate([
        {
          $match: {
            completedAt: { $exists: true },
            queuedAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $project: {
            timeInQueue: {
              $subtract: ["$completedAt", "$queuedAt"],
            },
          },
        },
        {
          $group: {
            _id: null,
            averageTime: { $avg: "$timeInQueue" },
          },
        },
      ]);

      return result[0]?.averageTime || 0;
    };

    const currentAverageTimeInMillis = await calculateAverageTime(start, end);
    const previousAverageTimeInMillis = await calculateAverageTime(
      prevStart,
      prevEnd
    );

    const convertToHoursAndMinutes = (timeInMillis: number) => {
      const totalMinutes = timeInMillis / (1000 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);
      return { hours, minutes };
    };

    const currentTime = convertToHoursAndMinutes(currentAverageTimeInMillis);
    const previousTime = convertToHoursAndMinutes(previousAverageTimeInMillis);

    const percentageDifference =
      previousAverageTimeInMillis === 0
        ? currentAverageTimeInMillis > 0
          ? 100
          : 0
        : ((currentAverageTimeInMillis - previousAverageTimeInMillis) /
            previousAverageTimeInMillis) *
          100;

    return {
      current: {
        hours: currentTime.hours,
        minutes: currentTime.minutes,
      },
      previous: {
        hours: previousTime.hours,
        minutes: previousTime.minutes,
      },
      percentageDifference,
    };
  } catch (error) {
    console.error(
      "Error calculating average queue time with comparison:",
      error
    );
    throw new Error("Unable to calculate average queue time with comparison");
  }
};

export const getBoatSailCountsByRange = async (range: string) => {
  try {
    const { start, end } = getDateRange(range);

    const sailCounts = await Queue.aggregate([
      {
        $match: {
          completedAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$boatId",
          sailCount: { $sum: 1 },
        },
      },
    ]);

    const boatIds = sailCounts.map((item) => item._id);
    const boats = await Boat.find({ _id: { $in: boatIds } });

    const result = sailCounts.map((item) => {
      const boat = boats.find(
        (boat) => boat._id.toString() === item._id.toString()
      );
      return {
        boatId: item._id,
        boatName: boat ? boat.boatName : "Unknown",
        sailCount: item.sailCount,
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching sail counts:", error);
    return [];
  }
};

export async function getPassengerDensityByRange(range: string) {
  const now = new Date();
  const timezoneOffset = 9 * 60 * 60 * 1000; // UTC+8 offset in milliseconds
  let startDate, groupBy, dates;

  switch (range) {
    case "today":
      startDate = new Date(now);
      startDate.setUTCHours(0, 0, 0, 0);
      groupBy = { $hour: "$localTime" };
      dates = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      break;

    case "this-week":
      const startOfWeek = new Date(now);
      startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay() + 1); // Monday
      startOfWeek.setUTCHours(0, 0, 0, 0);
      startDate = startOfWeek;
      groupBy = { $dayOfWeek: "$localTime" };
      dates = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      break;

    case "this-month":
      const startOfMonth = new Date(now);
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);
      startDate = startOfMonth;
      groupBy = { $dayOfMonth: "$localTime" };
      const daysInMonth = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1,
        0
      ).getDate();
      dates = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      break;

    case "this-year":
      const startOfYear = new Date(now.getUTCFullYear(), 0, 1);
      startOfYear.setUTCHours(0, 0, 0, 0);
      startDate = startOfYear;
      groupBy = { $month: "$localTime" };
      dates = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      break;

    default:
      throw new Error("Invalid range specified");
  }

  const data = await Passenger.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: now,
        },
      },
    },
    {
      $addFields: {
        localTime: { $add: ["$createdAt", timezoneOffset] },
      },
    },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const formattedData = dates.map((label, index) => {
    const found = data.find(
      (item) => item._id === (range === "this-week" ? index + 2 : index + 1)
    );
    return {
      label,
      count: found ? found.count : 0,
    };
  });

  return formattedData;
}

export const getQueueInsights = async () => {
  // Most visited destination
  const mostVisitedDestination = await Queue.aggregate([
    { $unwind: "$destination" },
    { $group: { _id: "$destination", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  // Busiest month (based on completed queues)
  const busiestMonth = await Queue.aggregate([
    { $match: { status: "completed" } }, // Only completed queues
    {
      $addFields: {
        localCompletedAt: {
          $dateToParts: {
            date: "$completedAt",
            timezone: "Asia/Singapore", // UTC+8 timezone
          },
        },
      },
    },
    {
      $group: {
        _id: "$localCompletedAt.month", // Group by month
        queueCount: { $sum: 1 },
      },
    },
    { $sort: { queueCount: -1 } }, // Sort by queue count
    { $limit: 1 }, // Get the busiest month
  ]);

  // Return results
  return {
    mostVisitedDestination: mostVisitedDestination[0]
      ? mostVisitedDestination[0]._id
      : "N/A",
    busiestMonth: busiestMonth[0] ? busiestMonth[0]._id : "N/A",
  };
};
