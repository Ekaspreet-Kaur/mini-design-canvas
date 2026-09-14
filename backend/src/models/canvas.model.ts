import mongoose, { Schema } from "mongoose";
import type { CanvasElement } from "../types/canvas.types";

const elementSchema = new Schema<CanvasElement>(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ["rectangle", "circle", "text"], required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    rotation: { type: Number, required: true, default: 0 },
    fill: { type: String, required: true },
    text: { type: String },
    fontSize: { type: Number },
  },
  { _id: false },
);

const canvasSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    width: { type: Number, required: true, min: 200, max: 5000 },
    height: { type: Number, required: true, min: 200, max: 5000 },
    elements: { type: [elementSchema], default: [] },
  },
  { timestamps: true },
);

export const Canvas = mongoose.model("Canvas", canvasSchema);
