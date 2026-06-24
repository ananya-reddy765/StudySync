import express from "express";
import {
  getTutors,
  getTutorById,
  createTutor,
} from "../controllers/tutorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTutors);

router.get("/:id", getTutorById);

router.post("/", protect, createTutor);

export default router;