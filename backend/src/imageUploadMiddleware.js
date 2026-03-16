import multer from "multer";
import { getEnvVar } from "./getEnvVar.js";

class ImageFormatError extends Error { }

const storageEngine = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, getEnvVar("IMAGE_UPLOAD_DIR"));
  },
  filename: function(req, file, cb) {
    // TODO: 2
    const mediaType = file.mimetype;
    let fileExtension;
    if (mediaType === "image/png") {
      fileExtension = "png";
    } else if (mediaType === "image/jpg" || mediaType === "image/jpeg") {
      fileExtension = "jpg";
    } else cb(new ImageFormatError("Unsupported image type"));
    const fileName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + fileExtension;
    cb(null, fileName);
  },
});

export const imageMiddlewareFactory = multer({
  storage: storageEngine,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export function handleImageFileErrors(err, req, res, next) {
  if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
    res.status(400).send({
      error: "Bad Request",
      message: err.message,
    });
    return;
  }
  next(err); // Some other error, let the next middleware handle it
}
