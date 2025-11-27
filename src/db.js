import mongoose from "mongoose";

export const connectDB = async (mongoUrl) => {
  if (!mongoUrl) {
    throw new Error("Missing MONGO_URL env var");
  }

  // Rekommenderas i nyare Mongoose-versioner
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(mongoUrl);
    console.log(
      `✅ Connected to MongoDB: ${mongoose.connection.name} (${mongoose.connection.host})`
    );
    return mongoose.connection;
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:");
    console.error(err.message);
    throw err; // låt server.js fånga detta och avsluta
  }
};
