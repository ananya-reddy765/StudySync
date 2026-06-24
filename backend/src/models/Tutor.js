import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: String,

    expertise: [String],

    hourlyRate: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 5,
    },

    totalSessions: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Tutor",
  tutorSchema
);