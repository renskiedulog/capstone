"use server";
import { connectMongoDB } from "../db";
import Activity from "@/models/Activity";

interface Activity {
  type: string;
  title: string;
  details: string;
  link?: string;
  actionBy: string;
}

export const addNewActivity = async (activityData: Activity) => {
  try {
    await connectMongoDB();
    const newActivity = new Activity(activityData);

    await newActivity.save();

    return true;
  } catch (error) {
    console.error("Error adding new activity:", error);
    return false;
  }
};
