import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URI) return console.log("Missing MongoDB URI");

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "david" });

    isConnected = true;

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
  }
};
