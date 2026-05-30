import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connectDatabase } from "./db.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { publicRoutes } from "./routes/publicRoutes.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";

app.use(
  cors({
    origin: webOrigin,
    credentials: false
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier" });
  }

  return res.status(500).json({ message: "Internal server error" });
});

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Hurdle Club service running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start service:", error.message);
    process.exit(1);
  });
