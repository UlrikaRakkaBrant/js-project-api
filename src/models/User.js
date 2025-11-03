import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [30, "Username must be at most 30 characters"],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // don’t return by default
    },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.index({ username: 1 }, { unique: true });

export const User = mongoose.model("User", UserSchema);
