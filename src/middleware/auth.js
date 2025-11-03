import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    const header = req.header("Authorization") || "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // fetch user (passwordHash was select:false)
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ error: "Invalid token user" });

    req.user = { id: user._id, username: user.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
