"use server";
import User from "@/models/User";
import { connectMongoDB } from "../db";

interface Activity {
    type: string,
    title: string,
    description: string,
    username?: string
}

export const addNewActivity = async ({ type, title, description, username }: Activity) => {
    console.log(type, title, description);
};