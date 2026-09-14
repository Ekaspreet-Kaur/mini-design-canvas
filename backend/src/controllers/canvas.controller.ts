import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { createCanvasSchema, updateCanvasSchema } from "../schemas/canvas.schema";
import * as canvasService from "../services/canvas.service";

export async function createCanvas(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createCanvasSchema.parse(req.body);
    const canvas = await canvasService.createCanvas(data);
    res.status(201).json({ success: true, data: canvas });
  } catch (error) {
    next(error);
  }
}

export async function getCanvases(_req: Request, res: Response, next: NextFunction) {
  try {
    const canvases = await canvasService.getCanvases();
    res.status(200).json({ success: true, data: canvases });
  } catch (error) {
    next(error);
  }
}

export async function getCanvasById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!mongoose.isValidObjectId(req.params.id as string)) {
      res.status(400).json({ success: false, error: "Invalid canvas id" });
      return;
    }
    const canvas = await canvasService.getCanvasById(req.params.id as string);
    if (!canvas) {
      res.status(404).json({ success: false, error: "Canvas not found" });
      return;
    }
    res.status(200).json({ success: true, data: canvas });
  } catch (error) {
    next(error);
  }
}

export async function updateCanvas(req: Request, res: Response, next: NextFunction) {
  try {
    if (!mongoose.isValidObjectId(req.params.id as string)) {
      res.status(400).json({ success: false, error: "Invalid canvas id" });
      return;
    }
    const data = updateCanvasSchema.parse(req.body);
    const canvas = await canvasService.updateCanvas(req.params.id as string, data);
    if (!canvas) {
      res.status(404).json({ success: false, error: "Canvas not found" });
      return;
    }
    res.status(200).json({ success: true, data: canvas });
  } catch (error) {
    next(error);
  }
}

export async function deleteCanvas(req: Request, res: Response, next: NextFunction) {
  try {
    if (!mongoose.isValidObjectId(req.params.id as string)) {
      res.status(400).json({ success: false, error: "Invalid canvas id" });
      return;
    }
    const canvas = await canvasService.deleteCanvas(req.params.id as string);
    if (!canvas) {
      res.status(404).json({ success: false, error: "Canvas not found" });
      return;
    }
    res.status(200).json({ success: true, data: canvas });
  } catch (error) {
    next(error);
  }
}


