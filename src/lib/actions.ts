"use server";
import User from "@/models/User";
import { connectMongoDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export const createTeller = async (prevState: any, formData: FormData) => {
  try {
    const values: any = {};
    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }

    await connectMongoDB();

    const hashedPassword = await bcrypt.hash(values.password, 10);

    const newUser = new User({
      username: values.username,
      password: hashedPassword,
      firstName: values.firstName,
      lastName: values.lastName,
      address: values.address,
      contact: values.contact,
      birthdate: new Date(values.birthdate),
      image: values.imageBase64,
    });

    await newUser.save();

    return {
      success: true,
      message: "Teller created successfully",
    };
  } catch (error: any) {
    console.error("Error creating teller:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

export const editTeller = async (prevState: any, formData: FormData) => {
  const values: any = {};

  for (const [key, value] of formData.entries()) {
    values[key] = value;
  }

  console.log(values);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    success: true,
    message: "Teller edited successfully",
  };
};
