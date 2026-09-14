import type { Canvas, CanvasPayload } from "../types/canvas";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? "Request failed");
  }
  return body.data;
}

export const canvasApi = {
  list: () => request<Canvas[]>("/canvases"),
  get: (id: string) => request<Canvas>(`/canvases/${id}`),
  create: (payload: CanvasPayload) =>
    request<Canvas>("/canvases", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: Partial<CanvasPayload>) =>
    request<Canvas>(`/canvases/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: string) => request<Canvas>(`/canvases/${id}`, { method: "DELETE" }),
};
