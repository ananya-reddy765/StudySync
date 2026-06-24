import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Explicitly configure — avoids relying on process.env timing issues
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dkz4gcm5s",
  api_key: process.env.CLOUDINARY_API_KEY || "229952395657546",
  api_secret: process.env.CLOUDINARY_API_SECRET || "1BrnKHRBi653obIAH8wy1B3m5TU",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    return {
      folder: `studysync/groups/${req.params.id}/resources`,
      resource_type: isImage ? "image" : "raw",
      ...(isImage && { allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"] }),
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
  },
});

export default cloudinary;