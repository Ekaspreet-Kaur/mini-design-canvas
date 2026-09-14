export const ELEMENT_TYPES = ["rectangle", "circle", "text"] as const;
export type ElementType = (typeof ELEMENT_TYPES)[number];

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

export interface CanvasDocumentData {
  name: string;
  width: number;
  height: number;
  elements: CanvasElement[];
}
