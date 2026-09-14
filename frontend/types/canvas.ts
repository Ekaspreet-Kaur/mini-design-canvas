export type ElementType = "rectangle" | "circle" | "text";

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  text?: string;
  fontSize?: number;
}

export interface Canvas {
  _id: string;
  name: string;
  width: number;
  height: number;
  elements: CanvasElement[];
  createdAt: string;
  updatedAt: string;
}

export interface CanvasPayload {
  name: string;
  width: number;
  height: number;
  elements: CanvasElement[];
}
