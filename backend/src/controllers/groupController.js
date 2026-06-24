import Group from "../models/Group.js";
import Resource from "../models/Resource.js";
import cloudinary from "../config/cloudinary.js";

// ─── Helper ──────────────────────────────────────────────────────────────────

const detectFileType = (mimeType = "") => {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("presentation") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("text")
  )
    return "doc";
  return "other";
};

const generateInviteCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

// Generate a signed Cloudinary URL (expires in 1 hour)
const generateSignedUrl = (publicId, resourceType = "raw") => {
  try {
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
    return cloudinary.url(publicId, {
      resource_type: resourceType,
      type: "upload",
      sign_url: true,
      expires_at: expiresAt,
      secure: true,
    });
  } catch {
    return null;
  }
};

// ─── Groups ──────────────────────────────────────────────────────────────────

// POST /api/groups
export const createGroup = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await Group.create({
      name,
      description,
      category,
      createdBy: req.user._id,
      members: [req.user._id],
      inviteCode: generateInviteCode(),
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/groups
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("createdBy", "name email")
      .populate("members", "name");

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/groups/:id
export const getGroupById = async (req, res) => {
  try {
    let group = await Group.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate({
        path: "resources",
        populate: { path: "uploadedBy", select: "name" },
      });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Auto-generate inviteCode for old groups that don't have one
    if (!group.inviteCode) {
      const newCode = generateInviteCode();
      await Group.updateOne({ _id: group._id }, { $set: { inviteCode: newCode } });
      group.inviteCode = newCode;
    }

    // Attach signed URLs to each resource
    const groupObj = group.toObject();
    groupObj.resources = groupObj.resources.map((r) => ({
      ...r,
      signedUrl: generateSignedUrl(
        r.publicId,
        r.fileType === "image" ? "image" : "raw"
      ) || r.url,
    }));

    res.json(groupObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Invite ──────────────────────────────────────────────────────────────────

// POST /api/groups/join/:inviteCode
export const joinByInvite = async (req, res) => {
  try {
    const group = await Group.findOne({
      inviteCode: req.params.inviteCode.toUpperCase(),
    });

    if (!group) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const alreadyMember = group.members
      .map((m) => m.toString())
      .includes(req.user._id.toString());

    if (alreadyMember) {
      return res.status(400).json({ message: "You are already a member" });
    }

    await Group.updateOne(
      { _id: group._id },
      { $push: { members: req.user._id } }
    );

    res.json({ message: "Joined successfully", groupId: group._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Resources ───────────────────────────────────────────────────────────────

// POST /api/groups/:id/resources
export const uploadResource = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members
      .map((m) => m.toString())
      .includes(req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ message: "Only members can upload files" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileType = detectFileType(req.file.mimetype);

    const resource = await Resource.create({
      group: group._id,
      uploadedBy: req.user._id,
      name: req.body.name || req.file.originalname,
      url: req.file.path,
      publicId: req.file.filename,
      fileType,
      size: req.file.size || 0,
      mimeType: req.file.mimetype,
    });

    await Group.updateOne(
      { _id: group._id },
      { $push: { resources: resource._id } }
    );

    const populated = await resource.populate("uploadedBy", "name");
    const resourceObj = populated.toObject();

    // Return signed URL immediately after upload
    resourceObj.signedUrl = generateSignedUrl(
      resource.publicId,
      fileType === "image" ? "image" : "raw"
    ) || resource.url;

    res.status(201).json(resourceObj);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/groups/:id/resources
export const getResources = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // ── Permission check: only members can get resources ──
    const isMember = group.members
      .map((m) => m.toString())
      .includes(req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ message: "Only members can view resources" });
    }

    const resources = await Resource.find({ group: req.params.id })
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    // Attach a fresh signed URL to every resource (expires in 1 hour)
    const signed = resources.map((r) => {
      const obj = r.toObject();
      obj.signedUrl = generateSignedUrl(
        r.publicId,
        r.fileType === "image" ? "image" : "raw"
      ) || r.url; // fall back to plain URL if signing fails
      return obj;
    });

    res.json(signed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/groups/:id/resources/:resourceId
export const deleteResource = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const resource = await Resource.findById(req.params.resourceId);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const isUploader =
      resource.uploadedBy.toString() === req.user._id.toString();
    const isCreator =
      group.createdBy?.toString() === req.user._id.toString();

    if (!isUploader && !isCreator) {
      return res.status(403).json({ message: "Not authorized to delete this file" });
    }

    try {
      await cloudinary.uploader.destroy(resource.publicId, {
        resource_type: resource.fileType === "image" ? "image" : "raw",
      });
    } catch (cloudErr) {
      console.warn("Cloudinary delete warning:", cloudErr.message);
    }

    await Group.updateOne(
      { _id: group._id },
      { $pull: { resources: resource._id } }
    );

    await resource.deleteOne();

    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};