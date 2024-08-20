"use server";
import User from "@/models/User";
import { connectMongoDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { options } from "@/app/(NextAuth)/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export const createTeller = async (prevState: any, formData: FormData) => {
  try {
    const values: any = {};
    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }

    await connectMongoDB();

    const hashedPassword = await bcrypt.hash(values.password, 10);

    const newUser = await User.create({
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
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};