import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

const fetchData = async (collectionName: string, query: any) => {
  try {
    const Model = mongoose.model(collectionName);
    const result = await Model.find(query);
    return result;
  } catch (error) {
    throw error;
  }
};

const updateData = async (collectionName: string, id: string, update: any) => {
  try {
    const Model = mongoose.model(collectionName);
    const result = await Model.findByIdAndUpdate(id, update, { new: true });
    return result;
  } catch (error) {
    throw error;
  }
};
