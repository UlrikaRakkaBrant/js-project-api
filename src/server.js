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

// ─────────────────────────────────────────────
// Middlewares
// ─────────────────────────────────────────────

// Lite striktare CORS (men fortfarande öppet nog för ditt frontend)
app.use(
  cors({
    origin: "*", // kan bytas till din Netlify-URL sen
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

// Root — auto-docs
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app).map((e) => ({
    methods: e.methods,
    path: e.path,
  }));

  res.json({
    name: "Happy Thoughts API (Week 3 + Auth)",
    docs: endpoints,
  });
});

// Health-check (bra för Render / debugging)
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/auth", authRouter);
app.use("/thoughts", thoughtsRouter);

// ─────────────────────────────────────────────
// 404 + Error handler
// ─────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ─────────────────────────────────────────────
// Start server + DB
// ─────────────────────────────────────────────

connectDB(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

// (valfritt: exportera app om du vill skriva tester)
export default app;
