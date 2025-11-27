import mongoose from "mongoose";

const ThoughtSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [5, "Message must be at least 5 characters"],
      maxlength: [140, "Message must be at most 140 characters"],
      trim: true,
    },
    hearts: {
      type: Number,
      default: 0,
      min: [0, "Hearts cannot be negative"],
    },
    tags: { type: [String], default: [] },
    author: { type: String, default: "Anonymous", trim: true },
    createdAt: { type: Date, default: Date.now },

    // 🆕 New field for Week 3 (auth)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false }
);

// Indexes for faster sorting and filtering
ThoughtSchema.index({ createdAt: -1 });
ThoughtSchema.index({ hearts: -1 });
ThoughtSchema.index({ message: "text" });
ThoughtSchema.index({ owner: 1 }); // 🆕 Add index for owner field

export const Thought = mongoose.model("Thought", ThoughtSchema);
