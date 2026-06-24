// backend/routes/studyRoomRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getStudyRooms,
  getStudyRoomById,
  createStudyRoom,
  deleteStudyRoom,
} from "../controllers/studyRoomController.js";

const router = express.Router();

router.get("/",    protect, getStudyRooms);
router.post("/",   protect, createStudyRoom);
router.get("/:id", protect, getStudyRoomById);
router.delete("/:id", protect, deleteStudyRoom);

export default router;