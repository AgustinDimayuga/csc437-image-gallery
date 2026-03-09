export function registerAuthRoutes(app, credentialsProvider) {
  app.post("/api/users", async (req, res) => {
    const { username, email, password } = req.body;
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        error: "Bad request",
        message: "Invalid or missing username, email, or password",
      });
    }
    const response = await credentialsProvider.registerUser(
      username,
      email,
      password,
    );
    if (!response) {
      res.status(409).send({
        error: "Conflict",
        message: "Username already taken",
      });
    }

    return res.status(200).send();
  });
}
