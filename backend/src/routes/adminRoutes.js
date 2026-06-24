import express from "express";

import {
  getTutorRequests,
  approveTutor,
  rejectTutor,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/tutor-requests",
  protect,
  getTutorRequests
);

router.put(
  "/approve/:id",
  protect,
  approveTutor
);

router.put(
  "/reject/:id",
  protect,
  rejectTutor
);

export default router;