"use client";

import type { CanvasElement } from "../../types/canvas";

interface Props { element: CanvasElement | null; onChange: (changes: Partial<CanvasElement>) => void; onDelete: () => void; }

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="block"><span className="mb-1 block text-xs font-medium text-slate-500">{label}</span><input type="number" value={Number.isFinite(value) ? Math.round(value) : 0} onChange={(e) => onChange(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900" /></label>;
}

export default function PropertiesPanel({ element, onChange, onDelete }: Props) {
  if (!element) return <aside className="w-72 border-l border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Select an element to edit its properties.</p></aside>;

  return <aside className="w-72 border-l border-slate-200 bg-white p-5">
    <div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-slate-400">Selected</p><h2 className="font-semibold capitalize text-slate-900">{element.type}</h2></div><button onClick={onDelete} className="rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50">Delete</button></div>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3"><NumberField label="X" value={element.x} onChange={(v) => onChange({ x: v })} /><NumberField label="Y" value={element.y} onChange={(v) => onChange({ y: v })} /></div>
      <div className="grid grid-cols-2 gap-3"><NumberField label="Width" value={element.width} onChange={(v) => onChange({ width: Math.max(10, v) })} /><NumberField label="Height" value={element.height} onChange={(v) => onChange({ height: Math.max(10, v) })} /></div>
      <NumberField label="Rotation" value={element.rotation} onChange={(v) => onChange({ rotation: v })} />
      <label className="block"><span className="mb-1 block text-xs font-medium text-slate-500">Fill</span><div className="flex gap-2"><input type="color" value={element.fill} onChange={(e) => onChange({ fill: e.target.value })} className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" /><input value={element.fill} onChange={(e) => onChange({ fill: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm" /></div></label>
      {element.type === "text" && <><label className="block"><span className="mb-1 block text-xs font-medium text-slate-500">Text</span><textarea value={element.text ?? ""} onChange={(e) => onChange({ text: e.target.value })} rows={4} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900" /></label><NumberField label="Font size" value={element.fontSize ?? 28} onChange={(v) => onChange({ fontSize: Math.max(8, v) })} /></>}
    </div>
  </aside>;
}
