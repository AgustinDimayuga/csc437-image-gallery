import {
  handleImageFileErrors,
  imageMiddlewareFactory,
} from "../imageUploadMiddleware.js";

export function registerImageRoutes(app, imageProvider) {
  function waitDuration(numMs) {
    return new Promise((resolve) => setTimeout(resolve, numMs));
  }
  app.get("/api/images", async (req, res) => {
    await waitDuration(1000);
    const response = await imageProvider.getAllImagesWithAuthor();
    res.send(response);
  });

  app.post(
    "/api/images",
    imageMiddlewareFactory.single("image"),
    handleImageFileErrors,
    async (req, res) => {
      try {
        // Final handler function after the above two middleware functions finish running
        const file = req.file;
        const name = req.body.name;

        // Check if both are present
        if (!file || !name) {
          return res.status(400).json({
            error: "Missing required fields",
            message: "You must submit both an image file and a name",
          });
        }
        const response = await imageProvider.createImage(
          file.filename,
          req.userInfo.username,
          name,
        );

        return res.status(201).json({
          message: "Image uploaded successfully",
          imageId: response,
        });
      } catch (e) {
        console.error(e.message);
        return res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  const MAX_NAME_LENGTH = 100;
  app.get("/api/images/:id", async (req, res) => {
    try {
      await waitDuration(1000);
      const response = await imageProvider.getOneImage(req.params.id);
      if (!response) {
        return res.status(404).send({
          error: "Not Found",
          message: "No image with that ID",
        });
      }
      return res.send(response);
    } catch (e) {
      console.error("failed to get image", e);

      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  app.patch("/api/images/:id", async (req, res) => {
    try {
      await waitDuration(1000);

      console.log(req.body);
      if (!req.body) {
        return res.status(400).send({
          error: "Bad Request",
          message: "Body is empty",
        });
      }
      const name = req.body.name;
      if (!name) {
        return res.status(400).send({
          error: "Bad Request",
          message:
            "Body did not contain name attrbute please include a proper name : value attribute",
        });
      }

      if (name.length > 100) {
        return res.status(413).send({
          error: "Content Too Large",
          message: `Image name exceeds ${MAX_NAME_LENGTH} characters`,
        });
      }
      const response = await imageProvider.updateImageName(
        req.params.id,
        name,
        req.userInfo.username,
      );
      if (response == 0) {
        return res.status(404).send({
          error: "Not Found",
          message: "Image does not exist",
        });
      } else if (response === -1) {
        return res.status(403).send({
          error: "Forbidden",
          message: "This user does not own this image",
        });
      }
      return res.status(204).send();
    } catch (e) {
      console.error("failed to update image", e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
