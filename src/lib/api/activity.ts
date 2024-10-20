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

export const getAllActivities = async () => {
  try {
    await connectMongoDB();
    const activities = await Activity.find().sort({ createdAt: -1 }).exec();

    return activities;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export const getActivitiesByDate = async (selectedDate: Date) => {
  try {
    await connectMongoDB();

    const startOfDay = new Date(selectedDate).setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate).setHours(23, 59, 59, 999);

    const activities = await Activity.find({
      createdAt: { $gte: new Date(startOfDay), $lte: new Date(endOfDay) }
    })
      .sort({ createdAt: -1 })
      .exec();

    return activities;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};