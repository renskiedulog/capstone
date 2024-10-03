"use server";
import Boat from "@/models/Boats";
import { connectMongoDB } from "../db";
import { checkSession } from "./requests";
import { revalidatePath } from "next/cache";

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

    const isExisting = await Boat.findOne({ boatCode: values.boatCode });

    if (isExisting) {
      return {
        success: false,
        message: "A boat with the code is already existing.",
      };
    }

    await Boat.create({
      mainImage: values.mainImageUpload ?? "",
      images: images,
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

    revalidatePath("/boats");

    return {
      success: true,
      message: "Boat created successfully",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const editBoat = async (prevState: any, formData: FormData) => {
  try {
    const newValues: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      newValues[key] = value;
    });

    const currentBoat = await Boat.findOne({ _id: newValues.id });

    const isExisting = await Boat.findOne({ boatCode: newValues.boatCode });

    if (currentBoat.boatCode !== newValues.boatCode && isExisting) {
      return {
        success: false,
        message: "A boat with the code is already existing.",
      };
    }

    const boatId = newValues.id;
    if (!boatId) {
      return {
        success: false,
        message: "Boat ID is required.",
      };
    }

    const updatedFields: { [key: string]: any } = {};
    const images: string[] =
      Object.keys(newValues)
        .filter((key) => key.startsWith("images-"))
        .map((key) => newValues[key]) ?? [];

    if (images.length !== 0) {
      updatedFields.images = images;
    } else {
      updatedFields.images = [];
    }

    for (const [key, value] of Object.entries(newValues)) {
      if (
        key !== "id" &&
        key !== "mainImg" &&
        key !== "uploadDocs" &&
        !key.startsWith("images-")
      ) {
        updatedFields[key] = value;
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return {
        success: false,
        message: "No changes detected.",
      };
    }

    const updatedBoat = await Boat.findByIdAndUpdate(
      boatId,
      { $set: updatedFields },
      { new: true }
    ).exec();

    if (!updatedBoat) {
      return {
        success: false,
        message: "Boat not found. Please try again.",
      };
    }

    revalidatePath("/boats");

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

  revalidatePath("/boats");
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

export const checkBoatCode = async (boatCode: string) => {
  try {
    await connectMongoDB();
    const existingBoat = await Boat.findOne({ boatCode });

    return existingBoat ? true : false;
  } catch (error: any) {
    throw new Error("Error checking username availability");
  }
};
