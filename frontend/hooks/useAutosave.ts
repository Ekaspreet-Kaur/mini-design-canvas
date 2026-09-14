import { useEffect, useRef } from "react";
import type { CanvasElement } from "../types/canvas";
import { canvasApi } from "../lib/api";

export function useAutosave(id: string, name: string, width: number, height: number, elements: CanvasElement[], onSaved: () => void) {
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        await canvasApi.update(id, { name, width, height, elements });
        onSaved();
      } catch {
        // The editor remains usable if an autosave fails; the explicit Save action can retry.
      }
    }, 800);

    return () => window.clearTimeout(timer);
  }, [id, name, width, height, elements, onSaved]);
}
