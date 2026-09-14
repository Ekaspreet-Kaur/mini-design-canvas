import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: error.flatten(),
    });
    return;
  }

  console.error(error);
  res.status(500).json({ success: false, error: "Internal server error" });
};
