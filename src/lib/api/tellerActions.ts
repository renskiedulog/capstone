"use server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../db";
import { checkSession } from "./requests";

export const createTeller = async (prevState: any, formData: FormData) => {
  try {
    const values: any = {};
    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }

    await connectMongoDB();

    const hashedPassword = await bcrypt.hash(values.password, 10);

    const req = await User.create({
      username: values.username,
      password: hashedPassword,
      fullName: `${values.firstName} ${values.lastName}`,
      firstName: values.firstName,
      email: values.email,
      lastName: values.lastName,
      address: values.address,
      contact: values.contact as string,
      birthdate: new Date(values.birthdate),
      image: values.imageBase64,
    });

    return {
      success: true,
      message: "Teller created successfully",
      data: req,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

export const fetchTellers = async () => {
  const checkAuth = await checkSession();
  if (!checkAuth) {
    return [];
  }
  try {
    await connectMongoDB();
    const req = await User.find({ isAdmin: false }).sort({ createdAt: -1 });
    const tellers = req.map((teller) => ({
      _id: teller._id.toString(),
      firstName: teller.firstName,
      lastName: teller.lastName,
      fullName: teller.fullName,
      username: teller.username,
      email: teller.email,
      password: teller.password,
      isAdmin: teller.isAdmin,
      address: teller.address,
      contact: teller.contact,
      birthdate: teller.birthdate,
      status: teller.status,
      createdAt: teller.createdAt.toISOString(),
      updatedAt: teller.updatedAt.toISOString(),
    }));

    return tellers;
  } catch (error) {
    return [];
  }
};

export const deleteTellerAccount = async (id: string) => {
  await connectMongoDB();
  const req = await User.deleteOne({ _id: id });

  if (req.acknowledged !== true) {
    return false;
  }
  return true;
};

export const isUsernameTaken = async (username: string) => {
  try {
    await connectMongoDB();
    const existingUser = await User.findOne({ username });

    return existingUser ? true : false;
  } catch (error: any) {
    throw new Error("Error checking username availability");
  }
};
