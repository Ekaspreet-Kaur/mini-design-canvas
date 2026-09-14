import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { canvasRouter } from "./routes/canvas.routes";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

export const app = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/canvases", canvasRouter);
app.use(notFoundHandler);
app.use(errorHandler);
