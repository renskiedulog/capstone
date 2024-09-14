"use server";
import User from "@/models/User";
import { connectMongoDB } from "../db";
import Activity from "@/models/Activity";

interface Activity {
  type: string;
  title: string;
  details: string;
  link?: string;
}

export const addNewActivity = async ({
  type,
  title,
  details,
  link,
}: Activity) => {
  try {
    const newActivity = new Activity({
      type,
      title,
      details,
      link,
    });

    await newActivity.save();

    return true;
  } catch (error) {
    console.error("Error adding new activity:", error);
    return false;
  }
};
