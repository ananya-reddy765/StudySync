// backend/controllers/studyRoomController.js
import mongoose from "mongoose";
import StudyRoom from "../models/StudyRoom.js";
import Group     from "../models/Group.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const isGroupMember = (group, userId) => {
  if (!group?.members) return false;
  return group.members.some(
    (m) =>
      m.toString()      === userId.toString() ||
      m?._id?.toString() === userId.toString()
  );
};

// ── GET /api/study-rooms ─────────────────────────────────────────────────────
export const getStudyRooms = async (req, res) => {
  try {
    const userId  = getUserId(req);
    const groups  = await Group.find({ members: userId });
    const groupIds = groups.map((g) => g._id);

    const rooms = await StudyRoom.find({
      $or: [
        { groupId: { $in: groupIds } },
        { isPublic: true },
      ],
      isActive: true,
    })
      .populate("groupId",   "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch study rooms" });
  }
};

// ── GET /api/study-rooms/:id ─────────────────────────────────────────────────
export const getStudyRoomById = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Room not found" });
    }

    const room = await StudyRoom.findById(req.params.id)
      .populate("groupId")
      .populate("createdBy", "name");

    if (!room || !room.isActive) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Public rooms: allow anyone; private rooms: check group membership
    if (!room.isPublic && room.groupId) {
      const group = await Group.findById(
        room.groupId._id || room.groupId
      );
      if (!isGroupMember(group, userId)) {
        return res.status(403).json({ message: "You don't have access to this room" });
      }
    }

    res.status(200).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch room" });
  }
};

// ── POST /api/study-rooms ────────────────────────────────────────────────────
export const createStudyRoom = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { roomName, description, subject, groupId, isPublic, maxMembers } = req.body;

    if (!roomName?.trim()) {
      return res.status(400).json({ message: "Room name is required" });
    }

    // If groupId provided, verify membership
    if (groupId) {
      if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
      }
      const group = await Group.findById(groupId);
      if (!group || !isGroupMember(group, userId)) {
        return res.status(403).json({ message: "You are not a member of this group" });
      }
    }

    const room = await StudyRoom.create({
      roomName:    roomName.trim(),
      description: description?.trim() || "",
      subject:     subject || "General",
      groupId:     groupId || null,
      createdBy:   userId,
      isPublic:    isPublic !== false,
      maxMembers:  maxMembers || 10,
      isActive:    true,
    });

    await room.populate("createdBy", "name");
    if (room.groupId) await room.populate("groupId", "name");

    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create room" });
  }
};

// ── DELETE /api/study-rooms/:id ──────────────────────────────────────────────
export const deleteStudyRoom = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Room not found" });
    }

    const room = await StudyRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the owner can delete this room" });
    }

    await room.deleteOne();
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete room" });
  }
};