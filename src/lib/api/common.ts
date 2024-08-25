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
