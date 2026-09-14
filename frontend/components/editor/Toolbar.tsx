"use client";

interface Props { onAdd: (type: "rectangle" | "circle" | "text") => void; onUndo: () => void; onRedo: () => void; canUndo: boolean; canRedo: boolean; onExport: () => void; }

export default function Toolbar({ onAdd, onUndo, onRedo, canUndo, canRedo, onExport }: Props) {
  return <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-3"><span className="mr-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Add</span><button onClick={() => onAdd("rectangle")} className="toolbar-btn">Rectangle</button><button onClick={() => onAdd("circle")} className="toolbar-btn">Circle</button><button onClick={() => onAdd("text")} className="toolbar-btn">Text</button><div className="mx-2 h-6 w-px bg-slate-200" /><button onClick={onUndo} disabled={!canUndo} className="toolbar-btn disabled:opacity-30">Undo</button><button onClick={onRedo} disabled={!canRedo} className="toolbar-btn disabled:opacity-30">Redo</button><button onClick={onExport} className="toolbar-btn ml-auto">Export PNG</button></div>;
}
