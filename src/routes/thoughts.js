import express from "express";
import { Thought } from "../models/Thought.js";


export const router = express.Router();


// GET /thoughts — list with filters, sort, pagination
router.get("/", async (req, res, next) => {
  try {
    const {
      q = "",
      minHearts,
      newerThan,
      tag,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = req.query;


    const query = {};


    if (q) {
      // text search or substring fallback
      query.$or = [
        { $text: { $search: q } },
        { message: { $regex: q, $options: "i" } },
      ];
    }


    if (minHearts !== undefined) {
      const n = Number(minHearts);
      if (!Number.isFinite(n)) return res.status(400).json({ error: "minHearts must be a number" });
      query.hearts = { $gte: n };
    }


    if (newerThan) {
      const d = new Date(newerThan);
      if (isNaN(d.getTime())) return res.status(400).json({ error: "newerThan must be an ISO date" });
      query.createdAt = { $gt: d };
    }


    if (tag) {
      const tags = String(tag).split(",").map((t) => t.trim()).filter(Boolean);
      if (tags.length) query.tags = { $in: tags };
    }


    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.min(100, Math.max(1, Number(limit)));


    const sortMap = { createdAt: "createdAt", hearts: "hearts" };
    const sortKey = sortMap[sort] || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;


    const [total, items] = await Promise.all([
      Thought.countDocuments(query),
      Thought.find(query)
        .sort({ [sortKey]: sortOrder, _id: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
    ]);


    res.json({ total, page: pageNum, limit: pageSize, results: items });
  } catch (err) {
    next(err);
  }
});


// GET /thoughts/:id — single
router.get("/:id", async (req, res, next) => {
  try {
    const item = await Thought.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Thought not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});