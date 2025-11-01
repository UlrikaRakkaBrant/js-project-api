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
    hearts: { type: Number, default: 0, min: [0, "Hearts cannot be negative"] },
    tags: { type: [String], default: [] },
    author: { type: String, default: "Anonymous", trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);


ThoughtSchema.index({ createdAt: -1 });
ThoughtSchema.index({ hearts: -1 });
ThoughtSchema.index({ message: "text" });


export const Thought = mongoose.model("Thought", ThoughtSchema);