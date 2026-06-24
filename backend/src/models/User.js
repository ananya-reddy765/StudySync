import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },

    // ================= PROFILE =================

    bio: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    // ================= GAMIFICATION =================

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    streak: {
      type: Number,
      default: 0,
    },

    questsCompleted: {
      type: Number,
      default: 0,
    },

    groupsJoined: {
      type: Number,
      default: 0,
    },

    liveSessions: {
      type: Number,
      default: 0,
    },

    // ================= BADGES =================

    badges: [
      {
        type: String,
      },
    ],

    // ================= TUTOR SYSTEM =================

    tutorApproved: {
      type: Boolean,
      default: false,
    },

    tutorRequest: {
      type: String,
      enum: [
        "none",
        "pending",
        "approved",
        "rejected",
      ],
      default: "none",
    },

    // ================= ACTIVITY =================

    recentActivity: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ================= PASSWORD HASH =================

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

  next();
});

// ================= PASSWORD MATCH =================

userSchema.methods.matchPassword =
  async function (enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

const User = mongoose.model(
  "User",
  userSchema
);

export default User;