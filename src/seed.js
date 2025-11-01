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
  await connectDB(process.env.MONGO_URL);

  const jsonPath = path.join(__dirname, "../data.json");
  const raw = fs.existsSync(jsonPath) ? fs.readFileSync(jsonPath, "utf8") : "[]";
  const items = JSON.parse(raw);

  await Thought.deleteMany({}); // clear existing data

  const docs = items.map((t) => ({
    message: t.message || t.text || "Hello world!",
    hearts: Number(t.hearts) || 0,
    tags: t.tags || [],
    author: t.author || "Anonymous",
    createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
  }));

  await Thought.insertMany(
    docs.length
      ? docs
      : [
        { message: "First happy thought!", hearts: 3, tags: ["intro"], author: "Ada" },
        { message: "Coffee + code = ❤️", hearts: 8, tags: ["coffee", "code"], author: "Linus" },
      ]
  );

  console.log("✅ Seeded thoughts");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
