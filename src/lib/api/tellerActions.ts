"use server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../db";
import { checkSession } from "./requests";

export const createTeller = async (prevState: any, formData: FormData) => {
  try {
    const values: any = {};
    for (const [key, value] of formData.entries() as any) {
      values[key] = value;
    }

    const existingUser = await User.findOne({ email: values.email });
    if (existingUser) {
      return {
        success: false,
        message: "Email already taken.",
      };
    }

    await connectMongoDB();

    const hashedPassword = await bcrypt.hash(values.password, 10);

    await User.create({
      username: values.username?.toLowerCase(),
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

export const fetchTellers = async (isDeleted: boolean = false) => {
  // accesses deleted teller accounts if true
  const checkAuth = await checkSession();
  if (!checkAuth) {
    return [];
  }
  try {
    await connectMongoDB();
    const req = await User.find({ isAdmin: false, isDeleted: isDeleted }).sort({
      createdAt: -1,
    });
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
      image: teller.image,
      contact: teller.contact,
      birthdate: teller.birthdate,
      status: teller.status,
      isDeleted: teller.isDeleted,
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
  const req = await User.findByIdAndDelete(id);

  return req !== null;
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

export const editTeller = async (prevState: any, formData: FormData) => {
  try {
    const newValues: { [key: string]: any } = {};
    for (const [key, value] of formData.entries() as any) {
      newValues[key] = value;
    }

    if (newValues.username) {
      newValues.username = newValues.username?.toLowerCase();
    }

    if (newValues.image === undefined) {
      newValues.image = "";
    }

    const userId = newValues.id;
    if (!userId) {
      return {
        success: false,
        message: "User ID is required.",
      };
    }

    const existingUser: any = await User.findById(userId).exec();
    if (!existingUser) {
      return {
        success: false,
        message: "Teller account not found. Please try again.",
      };
    }

    const checkUsers = await User.findOne({ email: newValues.email });
    if (checkUsers && checkUsers?.email !== existingUser?.email) {
      return {
        success: false,
        message: "Email already taken.",
      };
    }

    const existingUserObject = existingUser?.toObject();
    const updatedFields: { [key: string]: any } = {};

    if (
      newValues.password &&
      newValues.password !== existingUserObject.password
    ) {
      const hashedPassword = await bcrypt.hash(newValues.password, 10);
      updatedFields.password = hashedPassword;
    }

    let fullNameUpdated = false;
    if (newValues.firstName || newValues.lastName) {
      const newFirstName = newValues.firstName || existingUserObject.firstName;
      const newLastName = newValues.lastName || existingUserObject.lastName;

      if (newValues.firstName !== existingUserObject.firstName) {
        updatedFields.firstName = newFirstName;
      }

      if (newValues.lastName !== existingUserObject.lastName) {
        updatedFields.lastName = newLastName;
      }

      if (newValues.firstName || newValues.lastName) {
        updatedFields.fullName = `${newFirstName} ${newLastName}`;
        fullNameUpdated = true;
      }
    }

    if (newValues.image !== existingUserObject.image) {
      updatedFields.image = newValues.image;
    }

    for (const key in newValues) {
      if (
        newValues[key] !== existingUserObject[key] &&
        key !== "password" &&
        key !== "firstName" &&
        key !== "lastName" &&
        key !== "image"
      ) {
        updatedFields[key] = newValues[key];
      }
    }

    if (Object.keys(updatedFields).length === 0 && !fullNameUpdated) {
      return {
        success: false,
        message: "No changes applied.",
      };
    }

    await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    ).exec();

    return {
      success: true,
      message: "Teller edited successfully",
    };
  } catch (error) {
    console.error("Error updating teller:", error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const getTellerInfo = async (username: string) => {
  try {
    await connectMongoDB();

    const info = await User.findOne({ username: username });

    return info.toObject();
  } catch (error) {}
};

export const getAccounts = async () => {
  try {
    const users = await User.find({ isDeleted: false, isAdmin: false }).lean();

    const accounts = users
      .map((user) => ({
        fullName: user.fullName || `${user.firstName} ${user.lastName}`,
        email: user.email || "",
        image: user.image || "/avatars/default.png",
        status: user.status || "inactive",
        username: user.username,
      }))
      .sort((a, b) =>
        a.status === "active" && b.status !== "active" ? -1 : 1
      );

    return accounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw new Error("Unable to fetch accounts");
  }
};