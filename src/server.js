import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import { connectDB } from "./db.js";
import { router as thoughtsRouter } from "./routes/thoughts.js";
import { authRouter } from "./routes/auth.js";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());


// Root — auto-docs
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app).map((e) => ({ methods: e.methods, path: e.path }));
  res.json({ name: "Happy Thoughts API (Week 2)", docs: endpoints });
});


app.use("/auth", authRouter);
app.use("/thoughts", thoughtsRouter);


// 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));


// Error handler
app.use((err, req, res, next) => {
  console.error(err); // visible in server logs
  res.status(500).json({ error: "Internal Server Error" });
});


// Start
connectDB(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`\n🚀 API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });