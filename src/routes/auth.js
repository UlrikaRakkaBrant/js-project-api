// src/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authRouter = express.Router();

/* Small helper so both routes sign tokens the same way */
const TOKEN_TTL = "7d";
const signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
};

authRouter.get("/health", (_req, res) => {
  res.json({ ok: true, routes: ["/auth/signup", "/auth/login"] });
});

/* POST /auth/signup */
authRouter.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: "That username already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });

    const token = signToken({ userId: user._id });
    return res.status(201).json({ userId: user._id, username: user.username, token });
  } catch (err) {
    // Duplicate key enforced by unique index
    if (err?.code === 11000) {
      return res.status(409).json({ error: "That username already exists" });
    }
    console.error("Signup error:", {
      name: err?.name,
      message: err?.message,
      code: err?.code,
      stack: err?.stack,
    });
    return res.status(500).json({ error: "Signup failed" });
  }
});

/* POST /auth/login */
authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username }).select("+passwordHash");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ userId: user._id });
    return res.json({ userId: user._id, username: user.username, token });
  } catch (err) {
    console.error("Login error:", {
      name: err?.name,
      message: err?.message,
      code: err?.code,
      stack: err?.stack,
    });
    return res.status(500).json({ error: "Login failed" });
  }
});
