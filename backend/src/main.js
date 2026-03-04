import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const app = express();

app.get(Object.values(VALID_ROUTES), (req, res) => {
  res.sendFile("index.html", { root: STATIC_DIR });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});

const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";

app.use(express.static(STATIC_DIR));
