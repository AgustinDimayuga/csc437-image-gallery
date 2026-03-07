import express from "express";

import { getEnvVar } from "./getEnvVar.js";
import { SHARED_TEST } from "./shared/example.js";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";
import { connectMongo } from "./connectMongo.js";
import { ImageProvider } from "./ImageProvider.js";
import { registerImageRoutes } from "./routes/imageRoutes.js";

const myMongoClient = connectMongo();
const imageProvider = new ImageProvider(myMongoClient);
const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const app = express();
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.send("Hello, World " + SHARED_TEST);
});
app.get(Object.values(VALID_ROUTES), (req, res) => {
  res.sendFile("index.html", { root: STATIC_DIR });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});
registerImageRoutes(app, imageProvider);

const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";

app.use(express.static(STATIC_DIR));
