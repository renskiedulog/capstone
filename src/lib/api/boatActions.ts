"use server";

import Boat from "@/models/Boats";
import { connectMongoDB } from "../db";
import { checkSession } from "./requests";

export const createBoat = async (prevState: any, formData: FormData) => {
  try {
    const values: any = {};
    for (const [key, value] of formData.entries() as any) {
      values[key] = value;
    }

    const images: String[] = [];

    Object.keys(values).forEach((key) => {
      if (key.startsWith("images-")) {
        images.push(values[key]);
      }
    });

    await connectMongoDB();

    await Boat.create({
      mainImage: values.mainImageUpload ?? "",
      images: images,
      registrationNumber: values.registrationNumber,
      boatCode: values.boatCode,
      ownerName: values.ownerName,
      ownerContactNumber: values.ownerContactNumber,
      driverName: values.driverName,
      driverContactNumber: values.driverContactNumber,
      boatName: values.boatName,
      capacity: parseInt(values.capacity),
      lastCheck: values.lastCheck,
      checkingStatus: values.checkingStatus,
      boatFeatures: values.boatFeatures,
      additionalInfo: values.additionalInfo,
    });

    return {
      success: true,
      message: "Boat created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

export const editBoat = async (prevState: any, formData: FormData) => {
  try {
    const newValues: { [key: string]: any } = {};
    for (const [key, value] of formData.entries()) {
      newValues[key] = value;
    }

    const boatId = newValues.id;
    if (!boatId) {
      return {
        success: false,
        message: "Boat ID is required.",
      };
    }

    const existingBoat: Document | null = await Boat.findById(boatId).exec();
    if (!existingBoat) {
      return {
        success: false,
        message: "Boat not found. Please try again.",
      };
    }

    const existingBoatObject = existingBoat?.toObject();
    const updatedFields: { [key: string]: any } = {};

    if (newValues.mainImageUpload !== existingBoatObject.mainImage) {
      updatedFields.mainImage = newValues.mainImageUpload ?? "";
    }

    const images: string[] = Object.keys(newValues)
      .filter((key) => key.startsWith("images-"))
      .map((key) => newValues[key]);

    if (images.length > 0) {
      updatedFields.images = images;
    }

    const fieldsToUpdate = [
      "mainImage",
      "images",
      "registrationNumber",
      "boatCode",
      "ownerName",
      "ownerContactNumber",
      "driverName",
      "driverContactNumber",
      "boatName",
      "capacity",
      "lastCheck",
      "checkingStatus",
      "boatFeatures",
      "additionalInfo",
    ];

    fieldsToUpdate.forEach((field) => {
      if (newValues[field] != existingBoatObject[field]) {
        updatedFields[field] = newValues[field];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      return {
        success: false,
        message: "No changes applied.",
      };
    }

    const req = await Boat.findByIdAndUpdate(
      boatId,
      { $set: updatedFields },
      { new: true }
    ).exec();

    return {
      success: true,
      message: "Boat updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating boat:", error);
    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  }
};

export const fetchBoats = async (isDeleted: boolean = false) => {
  const checkAuth = await checkSession();
  if (!checkAuth) {
    return [];
  }
  try {
    await connectMongoDB();
    const req = await Boat.find({ isDeleted: isDeleted })
      .sort({ createdAt: -1 })
      .select("-images");

    const boats = req.map((boat) => {
      const { _id, ...rest } = boat.toObject();
      return {
        _id: _id.toString(),
        ...rest,
      };
    });

    return boats;
  } catch (error) {
    return [];
  }
};

export const deleteBoatAccount = async (id: string) => {
  await connectMongoDB();
  const req = await Boat.deleteOne({ _id: id });

  // if (req?.modifiedCount === 0) {
  //   return false;
  // }
  return true;
};

export const fetchBoatImages = async (id: string) => {
  try {
    const boat: any = await Boat.findById(id).select("images").lean();
    if (!boat) {
      throw new Error("Boat not found");
    }
    const imagesArray = boat.images;

    return imagesArray;
  } catch (error) {
    console.error(error);
  }
};
