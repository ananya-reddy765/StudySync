import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  requestTutorRole,
} from "../controllers/tutorRequestController.js";

const router = express.Router();

router.post(
  "/request",
  protect,
  requestTutorRole
);

export default router;