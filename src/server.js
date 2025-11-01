import cors from "cors";
import express from "express";
import listEndpoints from "express-list-endpoints";
import fs from "fs";
import path from "path";
import url from "url";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// --- Load data once on startup (Week 1 uses a hardcoded JSON file) ---
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "data.json");

// Guard: read + parse JSON (and fail loud if it’s missing/invalid)
let THOUGHTS = [];
try {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  THOUGHTS = JSON.parse(raw);
} catch (err) {
  console.error("Failed to load data.json:", err.message);
  // Keep empty array so server still boots (useful during setup)
  THOUGHTS = [];
}

// Helpers
const sorters = {
  date: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  hearts: (a, b) => a.hearts - b.hearts,
};

// --- Routes ---

// 1) API docs (Week 1 requirement: documentation at "/")
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app).map((e) => ({
    path: e.path,
    methods: e.methods,
    description:
      e.path === "/"
        ? "API documentation"
        : e.path === "/thoughts"
          ? "List thoughts with optional filtering, sorting and pagination"
          : e.path === "/thoughts/:id"
            ? "Fetch a single thought by its _id"
            : "",
  }));

  res.json({
    name: "Happy Thoughts API (Week 1)",
    routes: endpoints,
    examples: {
      allThoughts: "/thoughts",
      singleThought: "/thoughts/682bab8c12155b00101732ce",
      filtering: "/thoughts?minHearts=5",
      sorting: "/thoughts?sort=hearts&order=desc",
      paging: "/thoughts?page=2&limit=5",
    },
  });
});

// 2) Collection: GET /thoughts
// Query params:
//   - limit (number, default 20)
//   - page (number, default 1)
//   - minHearts (number, optional)
//   - sort ("date" | "hearts", optional)
//   - order ("asc" | "desc", default "desc" when sorting)
app.get("/thoughts", (req, res) => {
  const {
    limit = "20",
    page = "1",
    minHearts,
    sort,
    order = "desc",
  } = req.query;

  let results = [...THOUGHTS];

  // Optional filtering (stretch)
  if (minHearts !== undefined) {
    const min = Number(minHearts);
    if (!Number.isFinite(min)) {
      return res.status(400).json({ error: "minHearts must be a number" });
    }
    results = results.filter((t) => Number(t.hearts) >= min);
  }

  // Optional sorting (stretch)
  if (sort) {
    const key = sort.toLowerCase();
    if (!sorters[key]) {
      return res
        .status(400)
        .json({ error: "sort must be one of: date, hearts" });
    }
    results.sort(sorters[key]);
    if (order.toLowerCase() === "desc") results.reverse();
  } else {
    // Default: newest first by date
    results.sort(sorters.date).reverse();
  }

  // Pagination (stretch)
  const lim = Math.max(1, Math.min(100, Number(limit) || 20));
  const pg = Math.max(1, Number(page) || 1);
  const start = (pg - 1) * lim;
  const paged = results.slice(start, start + lim);

  res.json({
    total: results.length,
    page: pg,
    limit: lim,
    items: paged,
  });
});

// 3) Single item: GET /thoughts/:id
app.get("/thoughts/:id", (req, res) => {
  const { id } = req.params;
  const thought = THOUGHTS.find((t) => String(t._id) === String(id));

  if (!thought) {
    return res.status(404).json({
      error: "Thought not found",
      hint: "Check the id or list all at /thoughts",
    });
  }

  res.json(thought);
});

// --- Start server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
