// backend/src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✓ MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("✗ MongoDB connection failed:");
    console.error(`  Error: ${error.message}`);
    if (error.name === "MongoServerError") {
      console.error(`  Server Error: ${error.errmsg}`);
    }
    throw error;
  }
};

export default connectDB;