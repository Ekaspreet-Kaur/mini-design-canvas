"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CanvasElement, Canvas } from "../../types/canvas";
import { canvasApi } from "../../lib/api";
import { useHistory } from "../../hooks/useHistory";
import { useAutosave } from "../../hooks/useAutosave";
import PropertiesPanel from "./PropertiesPanel";
import LayersPanel from "./LayersPanel";
import Toolbar from "./Toolbar";

const CanvasStage = dynamic(() => import("../canvas/CanvasStage"), { ssr: false });

const colors = { rectangle: "#0f172a", circle: "#64748b", text: "#111827" } as const;

export default function CanvasEditor({ initialCanvas }: { initialCanvas: Canvas }) {
  const router = useRouter();
  const [name, setName] = useState(initialCanvas.name);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const history = useHistory<CanvasElement[]>(initialCanvas.elements);
  const elements = history.present;
  const selected = useMemo(() => elements.find((element) => element.id === selectedId) ?? null, [elements, selectedId]);

  const save = useCallback(async () => {
    setStatus("saving");
    try { await canvasApi.update(initialCanvas._id, { name, elements }); setStatus("saved"); }
    catch { setStatus("error"); }
  }, [initialCanvas._id, name, elements]);

  useAutosave(initialCanvas._id, name, initialCanvas.width, initialCanvas.height, elements, () => setStatus("saved"));

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? history.redo() : history.undo(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") { event.preventDefault(); history.redo(); }
      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) { event.preventDefault(); history.commit(elements.filter((item) => item.id !== selectedId)); setSelectedId(null); }
    };
    window.addEventListener("keydown", handleKey); return () => window.removeEventListener("keydown", handleKey);
  }, [history, elements, selectedId]);

  const updateElement = (id: string, changes: Partial<CanvasElement>) => history.commit(elements.map((item) => item.id === id ? { ...item, ...changes } : item));
  const mutateElement = (id: string, changes: Partial<CanvasElement>) => history.commit(elements.map((item) => item.id === id ? { ...item, ...changes } : item));

  const addElement = (type: CanvasElement["type"]) => {
    const id = crypto.randomUUID();
    history.commit([...elements, { id, type, x: 140 + elements.length * 18, y: 120 + elements.length * 18, width: type === "circle" ? 120 : 220, height: type === "circle" ? 120 : type === "text" ? 70 : 140, rotation: 0, fill: colors[type], ...(type === "text" ? { text: "Double-click or edit text", fontSize: 28 } : {}) }]);
    setSelectedId(id);
  };

  const deleteSelected = () => { if (!selectedId) return; history.commit(elements.filter((item) => item.id !== selectedId)); setSelectedId(null); };
  const moveLayer = (id: string, direction: "up" | "down") => { const index = elements.findIndex((item) => item.id === id); const nextIndex = direction === "up" ? index + 1 : index - 1; if (index < 0 || nextIndex < 0 || nextIndex >= elements.length) return; const next = [...elements]; [next[index], next[nextIndex]] = [next[nextIndex], next[index]]; history.commit(next); };

  const exportPng = () => {
    const stage = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!stage) return;
    const link = document.createElement("a"); link.download = `${name || "canvas"}.png`; link.href = stage.toDataURL("image/png"); link.click();
  };

  return <main className="flex h-screen flex-col bg-slate-50 text-slate-900">
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-5 py-3"><button onClick={() => router.push("/")} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100">←</button><div className="min-w-0 flex-1"><input value={name} onChange={(e) => setName(e.target.value)} className="w-full max-w-md bg-transparent text-lg font-semibold outline-none" /><p className="text-xs text-slate-400">{status === "saving" ? "Saving…" : status === "error" ? "Save failed" : "All changes saved"}</p></div><button onClick={save} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">Save</button></header>
    <Toolbar onAdd={addElement} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onExport={exportPng} />
    <LayersPanel elements={elements} selectedId={selectedId} onSelect={setSelectedId} onMove={moveLayer} />
    <div className="flex min-h-0 flex-1"><section className="min-w-0 flex-1 p-5"><CanvasStage width={initialCanvas.width} height={initialCanvas.height} elements={elements} selectedId={selectedId} onSelect={setSelectedId} onChange={mutateElement} onCommit={() => setStatus("saving")} /></section><PropertiesPanel element={selected} onChange={(changes) => selected && updateElement(selected.id, changes)} onDelete={deleteSelected} /></div>
  </main>;
}
