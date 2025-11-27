import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { Thought } from "./models/Thought.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await connectDB(process.env.MONGO_URL);

    // Load optional data.json
    const jsonPath = path.join(__dirname, "../data.json");
    const raw = fs.existsSync(jsonPath) ? fs.readFileSync(jsonPath, "utf8") : "[]";
    const items = JSON.parse(raw);

    console.log("🗑️ Clearing existing thoughts...");
    await Thought.deleteMany({});

    // Prepare documents → but do NOT set owner (only created thoughts should have owners)
    const docs = items.map((t) => ({
      message: t.message || t.text || "Hello world!",
      hearts: Number(t.hearts) || 0,
      tags: t.tags || [],
      author: t.author || "Anonymous",
      createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
    }));

    const seedData = docs.length
      ? docs
      : [
        {
          message: "First happy thought!",
          hearts: 3,
          tags: ["intro"],
          author: "Ada",
        },
        {
          message: "Coffee + code = ❤️",
          hearts: 8,
          tags: ["coffee", "code"],
          author: "Linus",
        },
      ];

    console.log(`🌼 Seeding ${seedData.length} thoughts...`);
    await Thought.insertMany(seedData);

    console.log("✨ Done! Thoughts have been seeded.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:");
    console.error(err);
    process.exit(1);
  }
};

run();
