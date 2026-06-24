import express from "express";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotes);

router.get("/:id", protect, getNote);

router.post("/", protect, createNote);

router.patch("/:id", protect, updateNote);

router.delete("/:id", protect, deleteNote);

export default router;