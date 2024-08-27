import User from "@/models/User";
import { connectMongoDB } from "../db";

export const getRecentTellers = async () => {
  try {
    await connectMongoDB();
    const tellers = await User.find().sort({ createdAt: -1 }).limit(5);

    return tellers;
  } catch (error) {
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
      $match: { isAdmin: false },
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
