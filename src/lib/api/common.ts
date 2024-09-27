"use server";
import User from "@/models/User";
import { connectMongoDB } from "../db";
import Activity from "@/models/Activity";
import Boat from "@/models/Boats";

export const getRecentTellers = async () => {
  try {
    await connectMongoDB();

    const tellers = await User.find({ isDeleted: false, isAdmin: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    const plainTellers = tellers.map((teller) => {
      const { _id, ...rest } = teller.toObject();
      return {
        _id: _id.toString(),
        ...rest,
      };
    });

    return plainTellers;
  } catch (error) {
    console.error("Error fetching recent tellers:", error);
    return [];
  }
};

export const getTellerCount = async () => {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  const results = await User.aggregate([
    {
      $match: { isAdmin: false, isDeleted: false },
    },
    {
      $facet: {
        totalTellers: [{ $count: "count" }],
        currentMonthTellers: [
          {
            $match: {
              createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth,
              },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const totalTellersCount = results[0].totalTellers[0]?.count || 0;
  const currentMonthTellersCount =
    results[0].currentMonthTellers[0]?.count || 0;

  return { totalTellersCount, currentMonthTellersCount };
};

export const logOutDB = async (username: string) => {
  try {
    if (username) {
      await connectMongoDB();
      const checkUser = await User.findOne({ username });
      if (checkUser) {
        checkUser.status = "inactive";
        await checkUser.save();
      }
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getRecentActivities = async () => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(5);
    const plainActivities = activities.map((activity) => {
      const { _id, ...rest } = activity.toObject();
      return {
        _id: _id.toString(),
        ...rest,
      };
    });
    return plainActivities;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export const getBoatCount = async () => {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  const results = await Boat.aggregate([
    {
      $match: { isDeleted: false },
    },
    {
      $facet: {
        totalBoats: [{ $count: "count" }],
        currentMonthBoats: [
          {
            $match: {
              createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth,
              },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const totalBoatCount = results[0].totalBoats[0]?.count || 0;
  const currentMonthBoatsCount = results[0].currentMonthBoats[0]?.count || 0;

  return { totalBoatCount, currentMonthBoatsCount };
};
