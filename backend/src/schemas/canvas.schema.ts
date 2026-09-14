import { z } from "zod";

const elementSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(["rectangle", "circle", "text"]),
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite().positive().max(5000),
  height: z.number().finite().positive().max(5000),
  rotation: z.number().finite().min(-360).max(360),
  fill: z.string().regex(/^#[0-9a-fA-F]{6}$/, "fill must be a hex color"),
  text: z.string().max(500).optional(),
  fontSize: z.number().finite().positive().max(300).optional(),
});

export const createCanvasSchema = z.object({
  name: z.string().trim().min(1).max(100),
  width: z.number().int().min(200).max(5000).default(1200),
  height: z.number().int().min(200).max(5000).default(700),
  elements: z.array(elementSchema).max(500).default([]),
});

export const updateCanvasSchema = createCanvasSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field is required" },
);
