// backend/models/StudyRoom.js
import mongoose from "mongoose";

const studyRoomSchema = new mongoose.Schema(
  {
    roomName: {
      type:     String,
      required: [true, "Room name is required"],
      trim:     true,
      maxlength: [100, "Room name cannot exceed 100 characters"],
    },
    description: {
      type:    String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    subject: {
      type:    String,
      default: "General",
      enum:    [
        "General", "Mathematics", "Science", "History",
        "English", "Computer Science", "Physics",
        "Chemistry", "Biology", "Art",
      ],
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "Group",
      default: null,
    },
    createdBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    isPublic: {
      type:    Boolean,
      default: true,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    maxMembers: {
      type:    Number,
      default: 10,
      min:     2,
      max:     50,
    },
  },
  { timestamps: true }
);

// Index for faster queries
studyRoomSchema.index({ groupId: 1, isActive: 1 });
studyRoomSchema.index({ isPublic: 1, isActive: 1 });
studyRoomSchema.index({ createdBy: 1 });

export default mongoose.model("StudyRoom", studyRoomSchema);