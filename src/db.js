import mongoose from "mongoose";


export const connectDB = async (mongoUrl) => {
  if (!mongoUrl) throw new Error("Missing MONGO_URL env var");
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUrl, {
    dbName: mongoUrl.split("/").pop().split("?")[0] || undefined,
  });
  return mongoose.connection;
};