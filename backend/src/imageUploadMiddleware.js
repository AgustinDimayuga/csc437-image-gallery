import multer from "multer";

class ImageFormatError extends Error { }

const storageEngine = multer.diskStorage({
  destination: function(req, file, cb) {
    // TODO 1
  },
  filename: function(req, file, cb) {
    // TODO 2
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
