"use server";
import User from "@/models/User";
import { connectMongoDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

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

export const editTeller = async (prevState: any, formData: FormData) => {
  const values: any = {};

  for (const [key, value] of formData.entries()) {
    values[key] = value;
  }

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    success: true,
    message: "Teller edited successfully",
  };
};

export const fetchTellers = async () => {
  await connectMongoDB();
  const req = await User.find({ isAdmin: false });
  const tellers = req.map((teller) => ({
    _id: teller._id.toString(),
    image: teller.image,
    firstName: teller.firstName,
    lastName: teller.lastName,
    fullName: teller.fullName,
    username: teller.username,
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
};

export const deleteTellerAccount = async (id: string) => {
  await connectMongoDB();
  const req = await User.deleteOne({ _id: id });
  revalidatePath("/tellers");

  if (req.acknowledged !== true) {
    return false;
  }
  return true;
};
