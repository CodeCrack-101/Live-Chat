import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.URL}`, {
      serverSelectionTimeoutMS: 5000, // fail fast if DB unreachable
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
};