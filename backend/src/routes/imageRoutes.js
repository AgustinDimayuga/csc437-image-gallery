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
    parseMultipartFormDataAndStoreToDisk,
    handleImageFileErrors,
    async (req, res) => {
      // Final handler function after the above two middleware functions finish running
      res.status(500).send("Not implemented");
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
      // TODO: body could be undefined fix this
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
