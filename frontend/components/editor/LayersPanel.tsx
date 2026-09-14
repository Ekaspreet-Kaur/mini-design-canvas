"use client";

import type { CanvasElement } from "../../types/canvas";

interface Props { elements: CanvasElement[]; selectedId: string | null; onSelect: (id: string) => void; onMove: (id: string, direction: "up" | "down") => void; }

export default function LayersPanel({ elements, selectedId, onSelect, onMove }: Props) {
  return <div className="border-b border-slate-200 bg-white p-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-900">Layers</h2><span className="text-xs text-slate-400">{elements.length} items</span></div><div className="max-h-36 space-y-1 overflow-auto">{[...elements].reverse().map((element, index, list) => <div key={element.id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${selectedId === element.id ? "bg-slate-100" : "hover:bg-slate-50"}`}><button onClick={() => onSelect(element.id)} className="min-w-0 flex-1 truncate text-left capitalize">{element.type === "text" ? element.text || "Text" : element.type}</button><button disabled={index === 0} onClick={() => onMove(element.id, "up")} className="text-xs text-slate-400 disabled:opacity-30">↑</button><button disabled={index === list.length - 1} onClick={() => onMove(element.id, "down")} className="text-xs text-slate-400 disabled:opacity-30">↓</button></div>)}</div></div>;
}
