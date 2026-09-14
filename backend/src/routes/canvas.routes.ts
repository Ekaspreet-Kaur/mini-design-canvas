import { Router } from "express";
import {
  createCanvas,
  deleteCanvas,
  getCanvasById,
  getCanvases,
  updateCanvas,
} from "../controllers/canvas.controller";

export const canvasRouter = Router();

canvasRouter.post("/", createCanvas);
canvasRouter.get("/", getCanvases);
canvasRouter.get("/:id", getCanvasById);
canvasRouter.put("/:id", updateCanvas);
canvasRouter.delete("/:id", deleteCanvas);
