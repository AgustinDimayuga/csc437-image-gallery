import jwt from "jsonwebtoken";
import { getEnvVar } from "../getEnvVar.js";

/**
 * Creates a Promise for a JWT token, with a specified username embedded inside.
 *
 * @param username the username to embed in the JWT token
 * @return a Promise for a JWT
 */
function generateAuthToken(username) {
  return new Promise((resolve, reject) => {
    const payload = {
      username,
    };
    jwt.sign(
      payload,
      getEnvVar("JWT_SECRET"),
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      },
    );
  });
}
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
      return res.status(409).send({
        error: "Conflict",
        message: "Username already taken",
      });
    }

    return res.status(200).send();
  });
  app.post("/api/auth/tokens", async (req, res) => {
    const { username, password } = req.body;
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        error: "Bad request",
        message: "Invalid or missing username, or password",
      });
    }
    const response = await credentialsProvider.verifyPassword(
      username,
      password,
    );
    if (response) {
      const token = await generateAuthToken(username);
      res.status(200).json({
        token: token,
      });
    } else {
      res.status(401).send({
        error: "Incorrect Username/ Password",
      });
    }
  });
}
