"use server";
import Boat from "@/models/Boats";

export const fetchBoatIds = async () => {
  try {
    const boats = await Boat.find()
      .select("_id boatName boatCode mainImage")
      .lean();
    return boats?.map((boat) => ({
      boatName: boat?.boatName,
      id: boat?._id?.toString(),
      boatCode: boat?.boatCode,
    }));
  } catch (error) {
    console.error("Error fetching boat IDs:", error);
    return [];
  }
};
