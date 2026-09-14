import { Canvas } from "../models/canvas.model";
import type { CanvasDocumentData } from "../types/canvas.types";

export async function createCanvas(data: CanvasDocumentData) {
  return Canvas.create(data);
}

export async function getCanvases() {
  return Canvas.find().sort({ updatedAt: -1 }).lean();
}

export async function getCanvasById(id: string) {
  return Canvas.findById(id).lean();
}

export async function updateCanvas(id: string, data: Partial<CanvasDocumentData>) {
  return Canvas.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteCanvas(id: string) {
  return Canvas.findByIdAndDelete(id).lean();
}
