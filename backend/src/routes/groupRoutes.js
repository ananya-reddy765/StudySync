import express from "express";

import {
  createGroup,
  getGroups,
  getGroupById,
  joinByInvite,
  uploadResource,
  getResources,
  deleteResource,
} from "../controllers/groupController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// ─── Groups ───────────────────────────────────────────────
router.route("/").get(protect, getGroups).post(protect, createGroup);

router.route("/:id").get(protect, getGroupById);

// ─── Invite ───────────────────────────────────────────────
// POST /api/groups/join/:inviteCode
router.post("/join/:inviteCode", protect, joinByInvite);

// ─── Resources ────────────────────────────────────────────
// GET  /api/groups/:id/resources
// POST /api/groups/:id/resources  (file upload)
router
  .route("/:id/resources")
  .get(protect, getResources)
  .post(protect, upload.single("file"), uploadResource);

// DELETE /api/groups/:id/resources/:resourceId
router.delete("/:id/resources/:resourceId", protect, deleteResource);

export default router;